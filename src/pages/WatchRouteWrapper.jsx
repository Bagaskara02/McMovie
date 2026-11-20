import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WatchPage from './WatchPage';

export function MovieWatchRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <WatchPage
      type="movie"
      id={id}
      onBack={() => navigate('/')}
      onMovieClick={(item) => {
        const targetType = item.media_type === 'tv' ? 'tv' : 'movie';
        navigate(`/watch/${targetType}/${item.id}`);
      }}
    />
  );
}

export function TvWatchRoute() {
  const { id, season = '1', episode = '1' } = useParams();
  const navigate = useNavigate();

  return (
    <WatchPage
      type="tv"
      id={id}
      season={season}
      episode={episode}
      onBack={() => navigate('/')}
      onMovieClick={(item) => {
        const targetType = item.media_type === 'tv' ? 'tv' : 'movie';
        navigate(`/watch/${targetType}/${item.id}`);
      }}
    />
  );
}

export function DubWatchRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <WatchPage
      type="dub"
      id={id}
      onBack={() => navigate('/')}
      onMovieClick={(item) => {
        navigate(`/watch/dub/${item.id}`);
      }}
    />
  );
}
