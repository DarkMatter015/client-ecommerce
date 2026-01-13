import type { IChatRequest } from "@/commons/types/Chat";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";

interface ChatFormProps {
	handleSendMessage: (e: any) => void;
}

export const ChatForm = ({ handleSendMessage }: ChatFormProps) => {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
		watch,
		reset,
	} = useForm<IChatRequest>({
		defaultValues: { message: "" },
		mode: "all",
	});

	const onSubmit = async (data: IChatRequest) => {
		reset();
		handleSendMessage(data);
	};

	const disabled =
		isSubmitting || (watch("message") || "").trim().length === 0;

	return (
		<form
			className="riff-footer"
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<Controller
				name="message"
				control={control}
				rules={{
					required: "Digite sua dúvida",
					maxLength: {
						value: 100,
						message: "Máximo de 100 caracteres",
					},
				}}
				render={({ field, fieldState }) => (
					<div className="p-inputgroup riff-input-group">
						<InputText
							id="message"
							type="text"
							placeholder="Digite sua dúvida ..."
							maxLength={100}
							aria-describedby="message-error"
							aria-invalid={!!fieldState.error}
							className="riff-input"
							{...field}
						/>
						<span className="riff-char-counter">
							{(watch("message") || "").length}/100
						</span>
					</div>
				)}
			/>

			<Button type="submit" className="riff-send-btn" disabled={disabled}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="22" y1="2" x2="11" y2="13"></line>
					<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
				</svg>
			</Button>
		</form>
	);
};
