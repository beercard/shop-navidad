import { CampaignExperience } from '../campaign-experience';

export const metadata = { title: 'Navidad Mágica · UniPlaza Shopping', description: 'Recorré UniPlaza Shopping y descubrí la campaña navideña.' };

export default function UniPlazaPage() {
  return <CampaignExperience initialShopping="uniplaza" />;
}
