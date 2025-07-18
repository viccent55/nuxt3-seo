import moment from "moment";
const useApp = () => {
  function dateStringTo12Hour(dateString: string, formatString = "YYYY-MM-DD") {
    return moment(dateString).format(formatString);
  }
  function dateStringTo24Hour(
    dateString: string,
    formatString = "YYYY-MM-DD HH:mm"
  ) {
    return moment(dateString).format(formatString);
  }

  return {
    dateStringTo12Hour,
    dateStringTo24Hour,
  };
};

export default useApp;
