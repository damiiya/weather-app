type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ErrorView({
  title = "문제가 발생했어요",
  description,
  onRetry,
}: Props) {
  return (
    <div className='py-3 text-center'>
      <p className='text-sm font-medium text-gray-900'>{title}</p>

      {description ? (
        <p className='mt-1 text-xs text-gray-500'>{description}</p>
      ) : null}

      {onRetry ? (
        <button
          type='button'
          className='mt-3 rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 focus:outline-none'
          onClick={onRetry}
        >
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
