import { useState, useRef } from "react"
import { useIsMobile } from "hooks"
import { format } from "date-fns"

import "./DatePicker.scss"

enum DatePart {
  None = "",
  Day = "dd",
  Month = "mm",
  Year = "yyyy"
}

export const DatePicker = () => {
  const [date, setDate] = useState("dd/mm/yyyy")
  const [trackInput, setTrackInput] = useState(false)
  const [selectedPart, setSelectedPart] = useState<DatePart>(DatePart.None)
  const [hasFocus, setHasFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [updateValue, setUpdateValue] = useState("")
  const isMobile = useIsMobile()

  const selectDatePart = (part: DatePart) => {
    if (part !== selectedPart) {
      setTrackInput(true)
    }

    switch (part) {
      case DatePart.None:
        setSelectedPart(DatePart.None)
        break
      case DatePart.Day:
        setSelectedPart(DatePart.Day)
        break
      case DatePart.Month:
        setSelectedPart(DatePart.Month)
        break
      case DatePart.Year:
        setSelectedPart(DatePart.Year)
        break
    }
  }

  const handleFocus = () => {
    selectDatePart(DatePart.Day)
    setHasFocus(true)
  }

  const handleSpanClick = () => {
    const input = inputRef.current
    if (!input || hasFocus) return
    input.focus()
  }

  const handleArrowLeft = () => {
    if (selectedPart === DatePart.Year) {
      selectDatePart(DatePart.Month)
    } else if (selectedPart === DatePart.Month) {
      selectDatePart(DatePart.Day)
    }
  }

  const handleArrowRight = () => {
    if (selectedPart === DatePart.Day) {
      selectDatePart(DatePart.Month)
    } else if (selectedPart === DatePart.Month) {
      selectDatePart(DatePart.Year)
    }
  }

  const handleTab = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedPart === DatePart.Year) {
      return
    } else if (selectedPart === DatePart.Day) {
      e.preventDefault()
      selectDatePart(DatePart.Month)
    } else if (selectedPart === DatePart.Month) {
      e.preventDefault()
      selectDatePart(DatePart.Year)
    }
  }

  const handleShiftTab = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedPart === DatePart.Day) {
      return
    } else if (selectedPart === DatePart.Month) {
      e.preventDefault()
      selectDatePart(DatePart.Day)
    } else if (selectedPart === DatePart.Year) {
      e.preventDefault()
      selectDatePart(DatePart.Month)
    }
  }

  const handleUpArrow = () => {
    let newDate = date
    switch (selectedPart) {
      case DatePart.Day: {
        const day = parseInt(newDate.substring(0, 2), 10) || 0
        const incrementedDay = (day % 31) + 1
        newDate = `${incrementedDay.toString().padStart(2, "0")}${newDate.substring(2)}`
        break
      }
      case DatePart.Month: {
        const month = parseInt(newDate.substring(3, 5), 10) || 0
        const incrementedMonth = (month % 12) + 1
        newDate = `${newDate.substring(0, 3)}${incrementedMonth
          .toString()
          .padStart(2, "0")}${newDate.substring(5)}`
        break
      }
      case DatePart.Year: {
        const year = parseInt(newDate.substring(6, 10), 10) || new Date().getFullYear() - 1
        const incrementedYear = year + 1
        newDate = `${newDate.substring(0, 6)}${incrementedYear.toString().padStart(4, "0")}`
        break
      }
      default:
        break
    }

    setDate(newDate)
  }

  const handleDownArrow = () => {
    let newDate = date
    switch (selectedPart) {
      case DatePart.Day: {
        const day = parseInt(newDate.substring(0, 2), 10) || 1
        const decrementedDay = day === 1 ? 31 : day - 1
        newDate = `${decrementedDay.toString().padStart(2, "0")}${newDate.substring(2)}`
        break
      }
      case DatePart.Month: {
        const month = parseInt(newDate.substring(3, 5), 10) || 1
        const decrementedMonth = month === 1 ? 12 : month - 1
        newDate = `${newDate.substring(0, 3)}${decrementedMonth
          .toString()
          .padStart(2, "0")}${newDate.substring(5)}`
        break
      }
      case DatePart.Year: {
        const year = parseInt(newDate.substring(6, 10), 10) || new Date().getFullYear() - 1
        const decrementedYear = year - 1
        newDate = `${newDate.substring(0, 6)}${decrementedYear.toString().padStart(4, "0")}`
        break
      }
      default:
        break
    }

    setDate(newDate)
  }

  const handleNumericKeyPress = (key: string) => {
    let newDate = ""
    let newSelectedPart = selectedPart

    switch (selectedPart) {
      case DatePart.Day: {
        const currentDay = date.substring(0, 2)
        if (!trackInput || (key >= "0" && key <= "3")) {
          if (currentDay === DatePart.Day || trackInput) {
            newDate = `0${key}${date.substring(2)}`
          } else {
            let day = parseInt(`${currentDay.substring(1, 2)}${key}`, 10)
            day = Math.min(Math.max(day, 1), 31)
            newDate = `${day.toString().padStart(2, "0")}${date.substring(2)}`
            newSelectedPart = DatePart.Month
          }
        } else {
          newDate = `0${key}${date.substring(2)}`
          newSelectedPart = DatePart.Month
        }
        break
      }
      case DatePart.Month: {
        const currentMonth = date.substring(3, 5)
        if (key === "0" || key === "1" || (key === "2" && !trackInput)) {
          if (currentMonth === DatePart.Month || trackInput) {
            newDate = `${date.substring(0, 3)}0${key}${date.substring(5)}`
          } else {
            let month = parseInt(`${currentMonth.substring(1, 2)}${key}`, 10)
            month = Math.min(Math.max(month, 1), 12)
            newDate = `${date.substring(0, 3)}${month.toString().padStart(2, "0")}${date.substring(
              5
            )}`
            newSelectedPart = DatePart.Year
          }
        } else {
          if (trackInput) {
            newDate = `${date.substring(0, 3)}0${key}${date.substring(5)}`
          } else {
            let month = parseInt(`${currentMonth.substring(1, 2)}${key}`, 10)
            month = Math.min(Math.max(month, 1), 12)
            newDate = `${date.substring(0, 3)}${month.toString().padStart(2, "0")}${date.substring(
              5
            )}`
          }
          newSelectedPart = DatePart.Year
        }
        break
      }
      case DatePart.Year: {
        const currentYear = date.substring(6, 10)
        if (currentYear === DatePart.Year) {
          newDate = `${date.substring(0, 6)}000${key}`
        } else {
          newDate = `${date.substring(0, 6)}${currentYear.substring(1, 4)}${key}`
        }
        break
      }
      default:
        return
    }

    setDate(newDate)
    setSelectedPart(newSelectedPart)
    setTrackInput(newSelectedPart !== selectedPart)
  }

  const handleDelete = () => {
    let newDate = date
    switch (selectedPart) {
      case DatePart.Day:
        newDate = DatePart.Day + date.substring(2)
        break
      case DatePart.Month:
        newDate = date.substring(0, 3) + DatePart.Month + date.substring(5)
        break
      case DatePart.Year:
        newDate = date.substring(0, 6) + DatePart.Year
        break
      default:
        break
    }

    setDate(newDate)
    setTrackInput(true)
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateValue(event.target.value)
    if (isMobile) {
      if (event.target.value) {
        setDate(format(new Date(event.target.value), "dd/MM/yyyy"))
      } else {
        setDate("dd/mm/yyyy")
      }
    }
  }

  return (
    <div className="date-picker-container">
      <div className="date-spans" onClick={handleSpanClick}>
        <span
          className={`day-section${
            selectedPart === DatePart.Day && !isMobile ? " section-selected" : ""
          }`}>
          {date.substring(0, 2)}
        </span>
        <span className="day-month-separator">/</span>
        <span
          className={`month-section${
            selectedPart === DatePart.Month && !isMobile ? " section-selected" : ""
          }`}>
          {date.substring(3, 5)}
        </span>
        <span className="month-year-separator">/</span>
        <span
          className={`year-section${
            selectedPart === DatePart.Year && !isMobile ? " section-selected" : ""
          }`}>
          {date.substring(6, 10)}
        </span>
      </div>
      <input
        ref={inputRef}
        type={isMobile ? "date" : "text"}
        spellCheck={false}
        className="govuk-input date-input"
        value={date}
        onChange={e => handleDateChange(e)}
        onBlur={() => {
          selectDatePart(DatePart.None)
          setHasFocus(false)
        }}
        onFocus={handleFocus}
        onKeyDown={e => {
          if (e.key === "ArrowRight") {
            handleArrowRight()
          } else if (e.key === "ArrowLeft") {
            handleArrowLeft()
          } else if (e.key === "Tab") {
            e.shiftKey ? handleShiftTab(e) : handleTab(e)
            return
          } else if (e.key === "ArrowUp") {
            if (selectedPart !== DatePart.None) {
              handleUpArrow()
            }
          } else if (e.key === "ArrowDown") {
            if (selectedPart !== DatePart.None) {
              handleDownArrow()
            }
          } else if (e.key === "Delete" || e.key === "Backspace") {
            handleDelete()
          } else if (/[0-9]/.test(e.key)) {
            handleNumericKeyPress(e.key)
          }
          e.preventDefault()
        }}
      />
      <div className="govuk-!-margin-top-2">{`On Change Value: '${updateValue}'`}</div>
    </div>
  )
}
