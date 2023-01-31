import {
	Registerer,
	UserAgent,
	UserAgentOptions,
	Web,
	SIPExtension,
} from "sip.js";

function getAudioElement(id: string): HTMLAudioElement {
	const el = document.getElementById(id);
	if (!(el instanceof HTMLAudioElement)) {
		throw new Error(`Element "${id}" not found or not an audio element.`);
	}
	return el;
}

const serverElem = document.getElementById("server") as HTMLInputElement;
const usernameElem = document.getElementById(
	"caller_username"
) as HTMLInputElement;
const passwordElem = document.getElementById(
	"caller_password"
) as HTMLInputElement;
const connectBtn = document.getElementById("connect");

connectBtn.addEventListener("click", async () => {
	const username = usernameElem.value;
	const password = passwordElem.value;
	const transportOptions = { server: serverElem.value, traceSip: true };
	const userAgentOptions: UserAgentOptions = {
		authorizationPassword: password,
		authorizationUsername: username,
		transportOptions,
		sipExtension100rel: SIPExtension.Supported,
		uri: UserAgent.makeURI(`sip:${username}`),
	};
	const userAgent = new UserAgent(userAgentOptions);
	const registerer = new Registerer(userAgent);
	// console.log("connect to", username, password, server);

	// Connect to server
	await userAgent.start().then(() => {
		registerer.register({
			requestDelegate: {
				onReject: () => {
					console.log("Register failed");
				},
				onAccept: () => {
					console.log("Register success");
				},
			},
		});
	});
});
