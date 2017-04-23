class SheetParser {
    constructor() {
        this.wordsFinder = new WordsFinder();
    }

    saveToLocalStorage(schedule) {
        localStorage.setItem('schedule', JSON.stringify(schedule));
    }

    getFromStorage() {
        return JSON.parse(localStorage.getItem('schedule'));
    }

    getSheduale(sheet) {
        let lastIndex = + _.words(sheet['!ref'], /[0-9]{1,2}/g)[1];
        let _firstDay = this.getFirstDay(sheet.A1.v);
        let fieldIndex = 3;
        let days = 0;
        let day = moment(_firstDay.format("DD.MM.YYYY"), "DD.MM.YYYY");
        let schedule = {
            [day]: {} 
        };
        let lessonss = 0;
        
        while(fieldIndex<lastIndex) {
            let firstDay = _firstDay;
            if(sheet["A"+fieldIndex]) {
                day = moment(_firstDay.format("DD.MM.YYYY"), "DD.MM.YYYY").add(days, "day");
                schedule[day] = [];
                days++;
                lessonss = 0;
            }

            if(sheet["B"+fieldIndex]) { 
                schedule[day].push({
                    time: sheet["B"+fieldIndex].v,
                });             
                
                if(sheet["C"+fieldIndex]) {
                    let value = sheet["C"+fieldIndex].v.split('\n');

                    schedule[day][lessonss].lesson = value[0] || "No information";
                    schedule[day][lessonss].lecturer = value[1] || "No information";

                }

                if(sheet["D"+fieldIndex]) {
                    schedule[day][lessonss].hall = sheet["D"+fieldIndex].v;
                }

                lessonss++;
            }


            fieldIndex++;
        }
        
        return schedule;
    }

    getFirstDay(str) {
        let years = this.getYears(str);

        let sheetStartAcademicYear = moment("01.09." + years[0], "DD.MM.YYYY");
        let sheetEndAcademicYear = moment("01.09." + years[1], "DD.MM.YYYY");
        
        let sheetDayMounts = this.getDayMountsIntervar(str)[0].split(" - ");

        let firstDay = moment(sheetDayMounts[0] + " " + years[0], "DD MMMM YYYY");
        let secondDay = moment(sheetDayMounts[0] + " " + years[1], "DD MMMM YYYY");

        if (firstDay < sheetStartAcademicYear && secondDay > sheetStartAcademicYear && secondDay < sheetEndAcademicYear) {
            return secondDay;
        }

        if (firstDay > sheetStartAcademicYear && firstDay < sheetEndAcademicYear) {
            return firstDay;
        }

        return "Can't find first day.";
    }

    invertSheetObject(sheet) {
        return _.invertBy(sheet, this.invertation);
    }

    getYears(str) {
        let yearInterval = this.wordsFinder.getYearInterval(str)[0];
        return this.wordsFinder.getYears(yearInterval);
    }

    getDayMountsIntervar(str) {
        return _.words(str, /[0-9]{1,2} [а-яА-я]+ - [0-9]{1,2} [а-яА-я]+/g);
    }

    getDayMounts(str) {
        return str.split("-");
    }

    getDay(sheet) {
        return _.words(sheet.A1, /20[0-9]{2}-/g);
    }

    invertation(v, prop = "v", defaultValue = "default") {
        return ('' + _.result(v, prop, defaultValue)).toUpperCase();
    }
}

class WordsFinder {
    
    getYearInterval(str) {
        return _.words(str, /20[0-9]{2}-20[0-9]{2}/g);
    }

    getYears(str) {
        return _.words(str, /20[0-9]{2}/g);
    }

    getDays(str) {
        return _.words(str, /[0-9]{1,2}/g);
    }

    getTimeInterval(str) {
        return _.words(str, /[0-9]{1,2}:[0-9]{1,2}-[0-9]{1,2}:[0-9]{1,2}/g)
    }

    getTime(str) {
        return _.words(str, /[0-9]{1,2}:[0-9]{1,2}/g);
    }
}

sheetParser = new SheetParser();