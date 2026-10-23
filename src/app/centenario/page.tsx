import { CampaignExperience } from '../campaign-experience';

export const metadata = { title: 'Navidad Mágica · Centenario Shopping', description: 'Descubrí la campaña navideña de Centenario Shopping en Corrientes.', manifest: '/manifest-centenario.webmanifest' };

export default function CentenarioPage() {
  return <CampaignExperience initialShopping="centenario" />;
}
