export const DEvents = Object.freeze({
  ROUTE: 'route',
  BREADCRUMB: 'breadcrumb',
  PROGRESS: 'progress'
});

export const DEventService = {
  dispatch: (evt, pay) => {
    const customEvent = new CustomEvent(evt, pay);
    window.dispatchEvent(customEvent);
  },
  subscribe: (evt, lis) => {
    window.addEventListener(evt, lis);
  },
  unsubscribe: (evt, lis) => {
    window.removeEventListener(evt, lis);
  }
};
