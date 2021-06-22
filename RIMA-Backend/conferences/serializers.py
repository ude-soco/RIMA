import json
from .models import(
 Platform,
 Conference,
 Conference_Event,
 Conference_Event_Paper,
 Author,
)

from rest_framework import serializers

#tracks = TrackSerializer(many=True, read_only=True)
class ConferenceEventPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conference_Event_Paper
        fields = "__all__"

class ConferenceEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conference_Event
        fields = "__all__"


class ConferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conference
        fields = ['conference_name_abbr', 'conference_url']


class PlatformSerializer(serializers.ModelSerializer):
    conferences = ConferenceSerializer(many=True)

    class Meta:
        model = Platform
        fields = ['platform_name', 'platform_url', 'conferences']

    def create(self, validated_data):
        conferences_data = validated_data.pop('conferences')
        platform = Platform.objects.create(**validated_data)
        for conference_data in conferences_data:
            Conference.objects.create(platform_name=platform, **conference_data)
        return platform

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"