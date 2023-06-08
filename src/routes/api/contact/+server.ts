import sgMail from "@sendgrid/mail";
import { PRIVATE_SENDGRID_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const formData = await request.json();

	const text = `
	Message from ${formData.name}, 
	Email: ${formData.email}, 
	Message: ${formData.message}`;

	sgMail.setApiKey(PRIVATE_SENDGRID_API_KEY);

	const msg = {
		to: "kyrregjerstad@gmail.com",
		from: "hi@kyrre.dev",
		subject: `New contact form message: ${formData.subject}`,
		name: formData.name,
		text: text
	};

	try {
		await sgMail.send(msg);
		return json({
			status: 200,
			body: {
				message: "Email sent successfully!"
			}
		});
	} catch (error) {
		return json({
			status: 500,
			body: {
				message: "There was an error sending the email."
			}
		});
	}
}
