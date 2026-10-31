import { EventLogEntryKinds } from '../constants';
import { describeReach } from '../utils/describeReach';
import { requestSendToTopic, requestSendToUser } from '../utils/sseDemoApi';
import { useRequestState } from './useRequestState';
import type { AddLogEntry } from '../../types';

type UseSendMessagesProps = {
  addLogEntry: AddLogEntry;
};

type SendToTopicProps = { topic: string; text: string };
type SendToUserProps = { userId: string; text: string };

export function useSendMessages(props: UseSendMessagesProps) {
  const { addLogEntry } = props;

  const topicRequest = useRequestState();
  const userRequest = useRequestState();

  async function sendToTopic(sendProps: SendToTopicProps) {
    const { topic, text } = sendProps;

    await topicRequest.run(async () => {
      const receivingNodesCount = await requestSendToTopic({ topic, text });

      const reach = describeReach({ receivingNodesCount, nobodyListening: 'no one in the topic has an open stream' });

      addLogEntry({ kind: EventLogEntryKinds.Sent, title: `Sent to #${topic} · ${reach}`, text });
    });
  }

  async function sendToUser(sendProps: SendToUserProps) {
    const { userId, text } = sendProps;

    await userRequest.run(async () => {
      const receivingNodesCount = await requestSendToUser({ userId, text });

      const reach = describeReach({ receivingNodesCount, nobodyListening: 'the user has no open stream' });

      addLogEntry({ kind: EventLogEntryKinds.Sent, title: `Sent to user ${userId} · ${reach}`, text });
    });
  }

  return {
    sendToTopic,
    isSendingToTopic: topicRequest.isPending,
    sendToTopicError: topicRequest.error,
    sendToUser,
    isSendingToUser: userRequest.isPending,
    sendToUserError: userRequest.error,
  };
}
