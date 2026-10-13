type UseScrollToEdgeProps = {
  to: 'top' | 'bottom';
  refElement: any;
  scrollBehavior?: 'smooth' | 'instant' | 'auto';
};

export function useScrollToEdge(props: UseScrollToEdgeProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';
  const { refElement, scrollBehavior = 'smooth', to } = props;

  const scrollToEdge = () => {
    refElement.current.scrollTo({
      top: to === 'top' ? 0 : refElement.current.scrollHeight,
      behavior: scrollBehavior,
    });
  };

  return { scrollToEdge };
}
