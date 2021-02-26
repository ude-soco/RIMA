from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView

from django.db.models import Q

from . import serializers as accounts_serializers
from . import models as accounts_models
from .utils import import_in_process_for_user

from interests.tasks import import_user_data


class RegisterView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        user_data = request.data
        #pchatti@test.de
        print(request.data)
        user_data["username"] = user_data.get("email")
        serializer = accounts_serializers.UserRegistrationSerializer(
            data=user_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.create(serializer.validated_data)
        user.set_password(serializer.validated_data["password"])
        user.save()
        import_user_data.delay(user.id)
        print(user)
        return Response(
            accounts_serializers.UserSerializer(instance=user).data)


class LoginView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def post(self, request):
        print(request.data)
        email = request.data.get("email")
        password = request.data.get("password")

        if email and password:
            user = accounts_models.User.objects.filter(
                email__iexact=email).first()
            if user and user.check_password(password):
                token, _ = Token.objects.get_or_create(user=user)
                response = accounts_serializers.UserSerializer(user).data
                response["token"] = token.key
                response["data_being_loaded"] = import_in_process_for_user(
                    user.id)
                return Response(response)
        return Response({"detail": "Invalid credentials"},
                        status=status.HTTP_400_BAD_REQUEST)


class DataLoadStatusView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(
            {"data_being_loaded": import_in_process_for_user(request.user.id)})


class LogoutView(APIView):
    """
    Invalidate auth token
    """
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({})


class UserView(RetrieveUpdateAPIView):
    serializer_class = accounts_serializers.UserSerializer

    def get_object(self):

        return self.request.user


class UserSuggestionView(ListAPIView):
    serializer_class = accounts_serializers.UserSerializer

    def get_queryset(self):
        term = self.kwargs.get("query")
        return accounts_models.User.objects.filter(
            Q(email__icontains=term)
            | Q(first_name__icontains=term)
            | Q(last_name__icontains=term))


class PublicProfileView(RetrieveAPIView):
    serializer_class = accounts_serializers.UserSerializer
    queryset = accounts_models.User.objects.all()

    def get_serializer_context(self):
        return {"request": self.request}
