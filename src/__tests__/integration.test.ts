import axios from 'axios';

const PAYMENT_SERVICE_URL = 'http://seamless-demo-payment:3000';
const NOTIFICATION_SERVICE_URL = 'http://seamless-demo-notification:3000';

// Health check
async function waitForService(url: string) {
  const maxRetries = 10;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await axios.get(`${url}/`);
      return;
    } catch (error) {
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`Could not connect to service: ${url}`);
}

// Integration tests
describe('payment and notification services integration test', () => {
  beforeAll(async () => {
    // Wait for all services to become available
    await Promise.all([
      waitForService(PAYMENT_SERVICE_URL),
      waitForService(NOTIFICATION_SERVICE_URL),
    ]);
  });

  test('receives response from payment service', async () => {
    const paymentResponse = await axios.post(
      `${PAYMENT_SERVICE_URL}/payments`,
      {
        amount: 42,
      },
    );

    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.data).toEqual({
      message:
        'Payment was received, and notification was sent to the customer',
    });
  });

  test('receives response from notification service', async () => {
    const notificationResponse = await axios.post(
      `${NOTIFICATION_SERVICE_URL}/notifications`,
      {
        message: 'hello',
      },
    );
    expect(notificationResponse.status).toBe(200);
    expect(notificationResponse.data).toEqual({
      message: 'Notification was sent to the customer',
    });
  });
});
