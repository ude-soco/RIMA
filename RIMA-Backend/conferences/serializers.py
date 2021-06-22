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
        fields = ['conference_event_name_abbr','paper_id', 'paper_doi','title','url','year','abstract','no_of_cititations','citiations','paper_venu']

class ConferenceEventSerializer(serializers.ModelSerializer):
    conference_papers = ConferenceEventPaperSerializer(many=True,read_only=True)

    class Meta:
        model = Conference_Event
        fields = ['conference_name_abbr','conference_event_name_abbr', 'conference_event_full_name','conference_event_url','conference_event_year','conference_papers']


class ConferenceSerializer(serializers.ModelSerializer):
    conference_events = ConferenceEventSerializer(many=True,read_only=True)

    class Meta:
        model = Conference
        fields = ['platform_name','conference_name_abbr', 'conference_url','conference_events']


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