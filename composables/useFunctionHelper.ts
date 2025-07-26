import moment from "moment";

const useFunctionHelper = {
  dateStringTo12Hour(dateString: string, formatString = "YYYY-MM-DD") {
    return moment(dateString).format(formatString);
  },
  dateStringTo24Hour(dateString: string, formatString = "YYYY-MM-DD HH:mm") {
    return moment(dateString).format(formatString);
  },
  dateStringTo12HourWithTime(
    dateString: string,
    formatString = "DD-MM-YYYY hh:mm a"
  ): string {
    return moment(dateString).format(formatString);
  },
  dateStringTo24HourWithTime(
    dateString: string,
    formatString = "DD-MM-YYYY HH:mm"
  ): string {
    return moment(dateString).format(formatString);
  },
  buildCommentTree(
    comments: any[],
    parentId = 0,
    user_uuid: string | null = null
  ): any[] {
    return comments
      .filter((comment) => comment.p_id === parentId)
      .map((comment) => ({
        ...comment,
        is_liked: comment.like_comment.some(
          (like: any) => like.user_uuid === user_uuid
        ),
        subComments: this.buildCommentTree(comments, comment.id, user_uuid),
      }));
  },
  debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },
};
export default useFunctionHelper;
