import { CampaignExperience } from '../campaign-experience';

export const metadata = { title: 'Navidad Mágica · Centenario Shopping', description: 'Descubrí la campaña navideña de Centenario Shopping en Corrientes.' };

export default function CentenarioPage() {
  return <CampaignExperience initialShopping="centenario" />;
}
