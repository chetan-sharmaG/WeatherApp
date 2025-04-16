export const convertTemperature=(temp,isCelsius)=> {
    return isCelsius ? temp : (temp * 9) / 5 + 32; 
  }

  export const convertDateToDay = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    return day;
  };