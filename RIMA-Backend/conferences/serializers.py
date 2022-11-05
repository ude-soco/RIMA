import json
from .models import(
 Platform,
 Conference,
 Conference_Event,
 Conference_Event_Paper,
 Author,
 PreloadedConferenceList,
)

from rest_framework import serializers

class PreloadedConferenceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreloadedConferenceList
        fields = "__all__"

class ConferenceEventPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conference_Event_Paper
        fields = ['paper_id', 'paper_doi','title','url','year','abstract','no_of_cititations','citiations','paper_venu']

class ConferenceEventSerializer(serializers.ModelSerializer):
    conference_event_papers = ConferenceEventPaperSerializer(many=True)

    class Meta:
        model = Conference_Event
        fields = ['conference_event_name_abbr','conference_name_abbr', 'conference_event_full_name','conference_event_url','no_of_stored_papers','conference_event_papers']

    def create(self, validated_data):
        papers_data = validated_data.pop('conference_event_papers')
        event = Conference_Event.objects.create(**validated_data)
        for paper_data in papers_data:
            Conference_Event_Paper.objects.create(conference_event_name_abbr=event, **paper_data)
        return Conference_Event


class ConferenceSerializer(serializers.ModelSerializer):
    conference_events = ConferenceEventSerializer(many=True,read_only=True)

    class Meta:
        model = Conference
        fields = ['conference_name_abbr','conference_url','conference_events']


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