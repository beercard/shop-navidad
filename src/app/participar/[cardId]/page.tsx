import ParticipateClient from './participate-client';

export default async function ParticipateRoute({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;
  return <ParticipateClient cardId={cardId} />;
}
