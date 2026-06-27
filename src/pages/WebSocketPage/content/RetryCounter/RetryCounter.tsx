type RetryCounterProps = {
  retryCount: number;
  maxRetries: number;
};

export default function RetryCounter(props: RetryCounterProps) {
  const { retryCount, maxRetries } = props;

  return (
    <span className='text-sm text-gray-600 dark:text-gray-400'>
      (Retry {retryCount}/{maxRetries})
    </span>
  );
}
