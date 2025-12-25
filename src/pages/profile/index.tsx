import { ProfileCardInformations } from "@/components/Profile/ProfileCardInformations";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import "./profile.style.css";

const Profile = () => {
    return (
        <div className="profile-page">
            <div className="profile-container">
                <ProfileCardInformations />

                {/* Additional Info Card */}
                <Card className="profile-card info-card">
                    <div className="info-section">
                        <div className="info-item">
                            <i className="pi pi-map-marker"></i>
                            <div>
                                <h4>Endereços</h4>
                                <p>
                                    Visualize e gerencie seus endereços salvos
                                </p>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-arrow-right"
                            className="p-button-text"
                            disabled
                            title="Em desenvolvimento"
                        />
                    </div>

                    <div className="info-section">
                        <div className="info-item">
                            <i className="pi pi-shopping-bag"></i>
                            <div>
                                <h4>Meus Pedidos</h4>
                                <p>Acompanhe o status de seus pedidos</p>
                            </div>
                        </div>
                        <Link to={"/pedidos"}>
                            <Button
                                icon="pi pi-arrow-right"
                                className="p-button-text"
                                title="Meus Pedidos"
                            />
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
