import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import "./info-card.style.css";

interface InfoCardProps {
    title: string;
    description: string;
    icon: string;
    link: string;
}

export const InfoCard = ({ title, description, icon, link }: InfoCardProps) => {
	return (
		<div className="info-section">
			<div className="info-item">
                <Link to={link} className="info-button">
                    <Button icon={`pi ${icon}`} title={title} className="info-button"/>
                </Link>
				<div>
					<h4>{title}</h4>
					<p>{description}</p>
				</div>
			</div>
            <div className="info-link">
                <Link to={link}>
                    <Button
                        icon="pi pi-arrow-right"
                        className="p-button-text"
                        title={title}
                    />
                </Link>
            </div>
		</div>
	);
};
