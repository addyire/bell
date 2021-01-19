var moment = require('moment')

module.exports = parser

function picker(data) {

    var today = new Date().getDay()

    return data[today]

}

function parser(classes, lang) {

    classes = picker(classes)

    findings = {
        current: undefined,
        end: undefined,
        next: undefined,
        special: false,
        last: false
    }

    if(!lang) return undefined;


    if(!classes) {

        findings.current = lang.noSchool
        findings.end = moment().add(1, 'd').hours(0).minutes(0).seconds(0).toISOString()
        findings.special = true

        return findings
    } 

    now = moment()

    startOfSchool = humanToComputer(classes[0].start)
    endOfSchool = humanToComputer(classes[classes.length - 1].end)

    if (now.isBefore(startOfSchool)) {

        findings.current = lang.beforeSchool
        findings.end = startOfSchool
        findings.next = classes[0].name
        findings.special = false

    } else if (now.isAfter(endOfSchool)) {

        console.log('after school')

        findings.current = lang.noClassesLeft
        findings.end = moment().add(1, 'd').hours(0).minutes(0).seconds(0)
        findings.special = true

    } else {

        for (var item = 0; item < classes.length; item++) {

            selected = classes[item]
            nextclass = classes[item + 1]

            var start = humanToComputer(selected.start)
            var end = humanToComputer(selected.end)

            if (now.isBetween(start, end)) {

                console.log('in class')

                findings.current = selected.name
                findings.end = end
                findings.link = selected.link

                console.log(selected.link)

                if (nextclass) {

                    findings.next = nextclass.name

                } else {

                    findings.next = lang.noClassesLeft
                    findings.last = true

                }


            } else if (nextclass) {

                nextStart = humanToComputer(nextclass.start)

                if (now.isBetween(end, nextStart)) {

                    console.log('Passing period between: ', selected, nextclass)

                    findings.current = lang.passingPeriod
                    findings.end = nextStart
                    findings.next = nextclass.name

                }

            }

        }

    }

    if (!findings.current &&
        !findings.end &&
        !findings.next &&
        !findings.special &&
        !findings.last) {

        findings = undefined
    }

    if(findings) {

        if(findings.end) {
            findings.end = findings.end.toISOString()
        }
        
    }

    return findings

}

function humanToComputer(value) {

    var [hours, mins] = value.split(':')

    return moment().hours(hours).minutes(mins).seconds(0)

}