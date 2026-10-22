import ParticipateClient from '../../../participar/[cardId]/participate-client';

export default async function UniPlazaParticipateRoute({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;
  return <ParticipateClient cardId={cardId} lockedShopping="uniplaza" />;
}
