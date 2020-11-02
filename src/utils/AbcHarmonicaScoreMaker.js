export default class AbcHarmonicaScoreMaker {
  constructor() {
    this.init()
  }

  init() {
    this.pitchNumberMap = {}
    this.pitchNumberMap[-7] = ["１"],// C,
    this.pitchNumberMap[-6.5] = ["ａ"],// ^C,
    this.pitchNumberMap[-6] = ["①"],// D,
    this.pitchNumberMap[-5.5] = ["Ａ"],// ^D,
    this.pitchNumberMap[-5] = ["２"],// E,
    this.pitchNumberMap[-4] = ["②", "ｂ"],// F,
    this.pitchNumberMap[-3.5] = ["Ｂ"],// ^F,
    this.pitchNumberMap[-3] = ["３"],// G,
    this.pitchNumberMap[-2.5] = ["ｃ"],// ^G,
    this.pitchNumberMap[-2] = ["③"],// A,
    this.pitchNumberMap[-1.5] = ["Ｃ"],// ^A,
    this.pitchNumberMap[-1] = ["④"],// B,
    this.pitchNumberMap[0] = ["５", "Ｄ", "４"],// C
    this.pitchNumberMap[0.5] = ["ｅ", "ｄ"],// ^C
    this.pitchNumberMap[1] = ["⑤"],// D
    this.pitchNumberMap[1.5] = ["Ｅ"],// ^D
    this.pitchNumberMap[2] = ["６"],// E
    this.pitchNumberMap[3] = ["⑥", "ｆ"],// F
    this.pitchNumberMap[3.5] = ["Ｆ"],// ^F
    this.pitchNumberMap[4] = ["７"],// G
    this.pitchNumberMap[4.5] = ["ｇ"],// ^G
    this.pitchNumberMap[5] = ["⑦"],// A
    this.pitchNumberMap[5.5] = ["Ｇ"],// ^A
    this.pitchNumberMap[6] = ["⑧"],// B
    this.pitchNumberMap[7] = ["９", "Ｈ", "８"],// c
    this.pitchNumberMap[7.5] = ["ｉ", "ｈ"],// ^c
    this.pitchNumberMap[8] = ["⑨"],// d
    this.pitchNumberMap[8.5] = ["Ｉ"],// ^d
    this.pitchNumberMap[9] = ["10"],// e
    this.pitchNumberMap[10] = ["⑩", "ｊ"],// f
    this.pitchNumberMap[10.5] = ["Ｊ"],// ^f
    this.pitchNumberMap[11] = ["11"],// g
    this.pitchNumberMap[11.5] = ["ｋ"],// ^g
    this.pitchNumberMap[12] = ["⑪"],// a
    this.pitchNumberMap[12.5] = ["Ｋ"],// ^a
    this.pitchNumberMap[13] = ["⑫"],// b
    this.pitchNumberMap[14] = ["12", "Ｌ"],// c'
    this.pitchNumberMap[14.5] = ["ｌ"]// ^c'

    this.latestBarOn = false
  }

  transform(tune, offsetPitch12) {
    this.offsetPitch12 = offsetPitch12
    tune.lines.forEach((line) => this.processLine(line))
  }

  processLine(line) {
    if (!line.staff || !line.staff[0]) {
      return
    }

    let accidentalByKeyMap = this.makeAccidentalByKeyMap(line)
    line.staff.forEach((staff) => {
      let voices = staff.voices[0]
      let accidentialTempMap = {}

      voices.forEach((voice) => {
        if (!voice.type) {// note
          // rest or end tie
          if (!voice.pitches || voice.pitches[0].endTie) {
            return
          }
          
          let pitch = voice.pitches[0].pitch
          let pitchCode = (pitch + 70) % 7
          let accidental = voice.pitches[0].accidental
          if (accidental) {
            let diff = 0
            if (accidental === "sharp") {
              diff = 0.5
              if (pitchCode === 2 || pitchCode === 6) {
                diff = 1
              }
            } else if (accidental === "dblsharp") {
              diff = 1
            } else if (accidental === "flat") {
              diff = -0.5
              if (pitchCode === 0 || pitchCode === 3) {
                diff = -1
              }
            } else if (accidental === "dblflat") {
              diff = 1
            } else if (accidental === "natural") {
              diff = 0
            }
            accidentialTempMap[pitch] = diff
            pitch += diff
          } else if (accidentialTempMap.hasOwnProperty(pitch)) {
            pitch += accidentialTempMap[pitch]
          } else if (!!accidentalByKeyMap[pitchCode]) {
            pitch += accidentalByKeyMap[pitchCode]
          }

          let number = ""

          let calculatedPitch = this.calcPitch(pitch, this.offsetPitch12)
          if (this.pitchNumberMap[calculatedPitch]) {
            let half = pitch % 1 !== 0
            let numberIndex = 0
            if (this.latestBarOn && this.pitchNumberMap[calculatedPitch].length > 1 && !half) {
              numberIndex = 1
            }
            number = this.pitchNumberMap[calculatedPitch][numberIndex]
            voice.chord = [{name: number, position: "below"}]

            this.latestBarOn = numberIndex == 1 || half
          }
        } else if (voice.type.indexOf("bar") !== -1) {
          accidentialTempMap = {}
        }
      })
    })
  }

  calcPitch(basePitch7, offsetPitch12) {
    let baseOctave = Math.floor((700 + basePitch7) / 7) - 100
    let baseScale7 = basePitch7 - baseOctave * 7
    let calculatedPitch12 = baseOctave * 12 + Math.round(baseScale7 * 1.8) + offsetPitch12
    let calculatedOctave = Math.floor((1200 + calculatedPitch12) / 12) - 100
    let calculatedScale12 = calculatedPitch12 - calculatedOctave * 12
    let calculatedPitch7 = calculatedOctave * 7 + Math.round(calculatedScale12 / 0.9) / 2
    return calculatedPitch7
  }

  makeAccidentalByKeyMap(line) {
    let accidentals = line.staff[0].key.accidentals
    let accidentalByKeyMap = {}
    accidentals.forEach((a) => {
      let pitchCode = a.verticalPos % 7
      let shift = 0
      if (a.acc === "sharp") {
        shift = 0.5
        if (pitchCode === 2 || pitchCode === 6) {
          shift = 1
        }
      } else if (a.acc === "flat") {
        shift = -0.5
        if (pitchCode === 0 || pitchCode === 3) {
          shift = -1
        }
      }
      accidentalByKeyMap[pitchCode] = shift
    })
    return accidentalByKeyMap
  }

  addUnderline(elem) {
    // convert alphabet to number, and add underline
    const map = {
      "ａ": "１",
      "ｂ": "２",
      "ｃ": "３",
      "ｄ": "４",
      "ｅ": "５",
      "ｆ": "６",
      "ｇ": "７",
      "ｈ": "８",
      "ｉ": "９",
      "ｊ": "10",
      "ｋ": "11",
      "ｌ": "12",
      "Ａ": "①",
      "Ｂ": "②",
      "Ｃ": "③",
      "Ｄ": "④",
      "Ｅ": "⑤",
      "Ｆ": "⑥",
      "Ｇ": "⑦",
      "Ｈ": "⑧",
      "Ｉ": "⑨",
      "Ｊ": "⑩",
      "Ｋ": "⑪",
      "Ｌ": "⑫"
    }
    for (let i = 0; i < elem.getElementsByTagName("text").length; i++) {
      let textObj = elem.getElementsByTagName("text")[i]
      let tspanObj = textObj.getElementsByTagName("tspan")[0]
      let text = tspanObj.innerHTML

      // adjust x
      textObj.setAttribute("x", textObj.getAttribute("x") - 3)
      tspanObj.setAttribute("x", tspanObj.getAttribute("x") - 3)

      if (map[text]) {
        text = map[text]
        textObj.innerHTML = text

        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute("x1", textObj.getAttribute("x"))
        line.setAttribute("x2", String(Number(textObj.getAttribute("x")) + 16))
        line.setAttribute("y1", String(Number(textObj.getAttribute("y")) + 4))
        line.setAttribute("y2", String(Number(textObj.getAttribute("y")) + 4))
        line.setAttribute("stroke", "black")
        line.setAttribute("stroke-width", "2")
        textObj.parentNode.insertBefore(line, textObj.nextSibling)
      }
    }
  }
}