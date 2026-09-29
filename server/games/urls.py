from xml.etree.ElementInclude import include

from django.urls import path
from .views import GameListView, GameDetailView

urlpatterns = [
    path('games/',  GameListView.as_view()),
    path('games/<int:pk>/', GameDetailView.as_view()),
]