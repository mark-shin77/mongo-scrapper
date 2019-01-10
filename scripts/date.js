var makeDate = () => {
    var date = new Date();
    var formattedDate = "";

    formattedDate += (date.getMonth() + 1 + " ");
    formattedDate += (date.getDate() + " ");
    formattedDate += (date.getFullYear);

    return formattedDate;
}

module.exports = makeDate;