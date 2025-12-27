import { ProfileCardInformations } from "@/components/Profile/ProfileCardInformations";
import { Card } from "primereact/card";
import "./profile.style.css";
import { InfoCard } from "@/components/Profile/InfoCard";

const Profile = () => {
	return (
		<div className="profile-page">
			<div className="profile-container">
				<ProfileCardInformations />

				<Card className="profile-card info-card">

                    <InfoCard
						title="Endereços"
						description="Visualize e gerencie seus endereços salvos"
						icon="pi-map-marker"
						link="/enderecos"
					/>

					<InfoCard
						title="Pedidos"
						description="Acompanhe o status de seus pedidos"
						icon="pi-shopping-bag"
						link="/pedidos"
					/>
				</Card>
			</div>
		</div>
	);
};

export default Profile;
