import twilio from 'twilio';

// ensure only one instance of Twilio client is created
const twilioClient: twilio.Twilio = singleton<twilio.Twilio>(
  'twilio',
  () =>
    twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN),
);

export async function sendSms(request: {
  from: string;
  to: string;
  body: string;
}) {
  return twilioClient.messages.create(request);
}

export function singleton<Value>(name: string, value: () => Value): Value {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= value();
  return g.__singletons[name];
}
