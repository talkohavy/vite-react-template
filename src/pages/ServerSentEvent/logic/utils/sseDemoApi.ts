import { API_URLS } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';
import type { DemoUser } from '../../types';

type LoginProps = { email: string; password: string };
type SendToTopicProps = { topic: string; text: string };
type SendToUserProps = { userId: string; text: string };
type SendResponse = { receivingNodesCount: number };

export async function requestLogin(props: LoginProps): Promise<DemoUser | null> {
  const { email, password } = props;

  const { promise } = httpClient.post(API_URLS.authLogin, { body: { email, password } });

  const user = await promise;
  const demoUser = toDemoUser(user);

  return demoUser;
}

export async function requestLogout(): Promise<void> {
  const { promise } = httpClient.post(API_URLS.authLogout, {});

  await promise;
}

/**
 * @returns The logged-in user, or null when there is no session.
 */
export async function requestProfile(): Promise<DemoUser | null> {
  try {
    const { promise } = httpClient.get(API_URLS.getProfile);

    const user = await promise;
    const demoUser = toDemoUser(user);

    return demoUser;
  } catch {
    return null;
  }
}

export async function requestMyTopics(): Promise<Array<string>> {
  const { promise } = httpClient.get<{ topics: Array<string> }>(API_URLS.sseDemoTopics);

  const { topics } = await promise;

  return topics;
}

export async function requestJoinTopic(topic: string): Promise<void> {
  const { promise } = httpClient.post(API_URLS.sseDemoJoinTopic, { body: { topic } });

  await promise;
}

export async function requestLeaveTopic(topic: string): Promise<void> {
  const { promise } = httpClient.post(API_URLS.sseDemoLeaveTopic, { body: { topic } });

  await promise;
}

/**
 * @returns How many server nodes received it. 0 means no one in the topic has an open stream.
 */
export async function requestSendToTopic(props: SendToTopicProps): Promise<number> {
  const { topic, text } = props;

  const { promise } = httpClient.post<SendResponse>(API_URLS.sseDemoSendToTopic, { body: { topic, text } });

  const { receivingNodesCount } = await promise;

  return receivingNodesCount;
}

/**
 * @returns How many server nodes received it. 0 means the user has no open stream anywhere.
 */
export async function requestSendToUser(props: SendToUserProps): Promise<number> {
  const { userId, text } = props;

  const { promise } = httpClient.post<SendResponse>(API_URLS.sseDemoSendToUser, { body: { userId, text } });

  const { receivingNodesCount } = await promise;

  return receivingNodesCount;
}

export function toDemoUser(user: any): DemoUser | null {
  if (user?.id == null) return null;

  const demoUser: DemoUser = { id: String(user.id), email: user.email ?? '' };

  return demoUser;
}
