import { useState, useEffect } from 'react';
import styles from "./general.module.css"
import logo from "../assets/vbit logo.png"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import * as XLSX from "xlsx";



interface rolesData{
    "COE": string,
    "Principal": string,
    "Chief": string
}

const GeneralTab = () => {

    const COLS = 4
    const ROWS = 6
    const [header, setHeader] = useState<string>("");
    const [data, setData] = useState<string[][]>([]);
    const [headerList, setHeaderList] = useState<string[]>([]);
    // const [headerData, setHeaderData] = useState<string[]>([]);
    const [facultyData, setFacultyData] = useState<string[][]>([]);

    // const [facroom, setFacroom] = useState<string[][]>([])

    const yearMappings = ["I",
         "II",
        "III",
        "IV"
        ]

    const deptMappings:{[num:number]:string} = {
        1: "CE",
        2: "EEE",
        3: "ME",
        4: "ECE",
        5: "CSE",
        12: "IT",
        32: "CSB",
        62: "CSC",
        66: "CSM",
        67: "CSD"
    }


    // useEffect(()=>{
    //     html2canvas(document.getElementById("page1") as HTMLElement).then(canvas => {
    //         const url = canvas.toDataURL("image/png");
    //         const newpdf = new jsPDF();
    //         newpdf.addImage(url, "PNG", 0, 0,0,0,"page1","SLOW");
    //         newpdf.save("test.pdf")
    //     })
    // },[])

    const roles :rolesData = {
        "COE": "Controller of the Examinations",
        "Chief": "Cheif Superintendent",
        "Principal": "Principal"
    }

    const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(typeof(e))
        const file = e.target.files!["0"];
        const reader = new FileReader();

        reader.onload = () => {
            const bstr = reader.result;
            const wb = XLSX.read(bstr, { type: "array" });
            // console.log(wb);
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            var tempdata = XLSX.utils.sheet_to_csv(ws);
            const splitdata = tempdata.split("\n");
            // setHeaderData(splitdata[0].split(","));

            if (!faculty) {
                let temp = [];
                let subTemp = [];
                for (let i = 1; i < splitdata.length; i++) {
                    subTemp.push(splitdata[i]);
                    if (i % (ROWS * COLS) === 0 || i === splitdata.length - 1) {
                        temp.push(subTemp);
                        subTemp = [];
                    }
                }

                setGlobalYear(yearMappings[parseInt(temp[0][0].split(",")[year])])
                setGlobalSem(yearMappings[parseInt(temp[0][0].split(",")[semester])])
                setGlobalRegulation(temp[0][0].split(",")[regulation])
                // console.log(temp);
                setData(temp);

                let lols: string[] = []
                let subs: string[][] = []

                temp.forEach((item) => {
                    let local: string[] = []
                    item.forEach((itemsub) => {
                        let sub = itemsub.split(",")[subject]
                        let deptData: string = deptMappings[parseInt(itemsub.split(",")[dept])]
                        if (local?.indexOf(sub + " - " + deptData) === -1)
                            local?.push(sub + " - " + deptData)
                        itemsub.split(",")[7] != "" && lols.push(itemsub.split(",")[7])
                    })
                    subs.push(local)
                })
                console.log(subs)
                setRoomList(lols)
                setSubList(subs)
            }
            else {
                let temp: string[] = [];
                let roomTemp: string[] = [];
                splitdata.slice(1).forEach((item) => {
                    const data = item.split(",")
                    temp.push(data[0])
                    roomTemp.push(data[1])
                })
                console.log(temp, roomTemp)
                // shuffle roomTemp
                for (let i = 1; i < temp.length; i++) {
                    const j = Math.floor(Math.random() * (temp.length));
                    let inter: string = temp[i];
                    temp[i] = temp[j];
                    temp[j] = inter;
                }
                let big: string[][] = []
                let dat: string[] = []
                for (let i = 0; i < roomTemp.length; i++) {
                    if (!temp[i])
                        dat.push("N/A" + "," + roomTemp[i]!)
                    else if (!roomTemp[i])
                        dat.push(temp[i] + "," + "N/A")
                    else
                        dat.push(temp[i] + "," + roomTemp[i])

                    console.log(dat)
                    if (i !== 0 && (i % 19 === 0 || i === roomTemp.length - 1)) {
                        big.push(dat)
                        dat = []
                    }
                }
                console.log(big)
                setFacultyData(big)
                // setFacroom(roomTemp)
            }
            reader.abort();

        };
        // reader.readAsBinaryString(file);
        reader.readAsArrayBuffer(file)

    }

    const captureHeader = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const data = e.target.value;
        setHeader(data);
    }

    const getHeader = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setHeaderList((prev) => [...prev, header]);
            setHeader("");
            const ele = document.getElementById("textInput") as HTMLInputElement
            ele.value = ""
        }
    }

    const deleteHeader = (index: number) => {
        return () => {
            setHeaderList((prev) => {
                const temp = [...prev];
                temp.splice(index, 1);
                return temp;
            })
        }
    }



    const [serial, setSerial] = useState<number>(-1)
    serial
    const [hallticket, setHallticket] = useState<number>(-1)
    const [year, setYear] = useState<number>(-1)
    const [semester, setSemester] = useState<number>(-1)
    const [dept, setDept] = useState<number>(-1)
    const [subject, setSubject] = useState<number>(-1)

    const [faculty, setFaculty] = useState<boolean>(false)
    const [check, setCheck] = useState<boolean>(false)
    const [date, setDate] = useState<Date>(new Date())
    const [examType, setExamType] = useState<string>("Regular")
    const [regulation, setRegulation] = useState<number>(-1)
    const [globalYear, setGlobalYear] = useState<string>("")
    const [globalSem, setGlobalSem] = useState<string>("")
    const [globalRegulation, setGlobalRegulation] = useState<string>("")

    const [roomList, setRoomList] = useState<string[]>([])
    const [subList, setSubList] = useState<string[][]>([])
    const [role, setRole] = useState<"COE"|"Chief"|"Principal">("COE")


 


    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value)
        setDate(date)
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const handleCapture = () => {

        new Array(data.length || facultyData.length).fill(0).forEach((item, index) => {
            item
            html2canvas(document.getElementById("page" + index) as HTMLElement).then(canvas => {
                const url = canvas.toDataURL("image/png");
                pdf.addImage(url, "PNG", 0, 0, 0, 0, "page" + index, "SLOW");
                if (data.length>0 && index != data.length - 1)
                    pdf.addPage()
                
                if(facultyData.length>0 && index != facultyData.length - 1)
                pdf.addPage()
            })
        })
    }
    const handleSave = () => {
        pdf.save("test.pdf")
    }


    useEffect(() => {

        setSerial(headerList.indexOf("serial"))
        setHallticket(headerList.indexOf("hallticket"))
        setYear(headerList.indexOf("year"))
        setSemester(headerList.indexOf("semester"))
        setRegulation(headerList.indexOf("regulation"))
        setDept(headerList.indexOf("dept"))
        setSubject(headerList.indexOf("subject"))

        const FNcheck = document.getElementById("FN") as HTMLInputElement
        if (FNcheck.checked) {
            const from  = document.getElementById("from") as HTMLInputElement
            const to = document.getElementById("to") as HTMLInputElement
            from.value = "09:50"
            to.value = "12:50"
        }
        const ANcheck = document.getElementById("AN") as HTMLInputElement
        if (ANcheck.checked) {
            const from = document.getElementById("from") as HTMLInputElement
            from.value = "13:30"
            const to = document.getElementById("to") as HTMLInputElement
            to.value = "16:30"
        }


    }, [headerList, check, date])

    const handleExamType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const data = e.target.value;
        setExamType(data.charAt(0).toUpperCase() + data.slice(1));
    }

    var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;

    return (
        <div className={styles.generalRoot}>
            <div className={styles.consoleTab}>
                {/* <span className={styles.excelButton}> */}

                <span className={styles.columnOrder}>
                    <textarea id="textInput" onKeyDown={(e) => getHeader(e)} onChange={captureHeader} maxLength={10} className={styles.textInput} placeholder="Enter the column headings in order"></textarea>
                    <span className={styles.headers}>
                        {headerList.map((item, index) => {
                            return (
                                <span id={index + ''} className={styles.headerItem}>{item}
                                    <span className={styles.deleteIcon} onClick={deleteHeader(index)}>
                                        <svg className="icon icon-tabler icon-tabler-trash" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M4 7l16 0" />
                                            <path d="M10 11l0 6" />
                                            <path d="M14 11l0 6" />
                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                        </svg>
                                    </span>
                                </span>
                            )
                        })
                        }
                    </span>
                </span>

                <div className={styles.faculty}>
                    <span>
                        <label style={{ fontSize: "1.5em", color: "black" }} htmlFor="FN">Faculty</label>
                        <input onClick={() => setFaculty((prev) => !prev)} type='checkbox' id="faculty" name='faculty' value={"faculty"} />
                    </span>
                </div>
                <div className={styles.examType}>
                    <textarea value={examType} onChange={handleExamType} maxLength={15} className={styles.textInput} id="examtype"></textarea>
                </div>
                <div className={styles.dateSelect}>
                    <input type='date' onChange={handleDate} />
                </div>

                <div className={styles.session}>
                    <span >
                        <label style={{ fontSize: "1em", color: "black" }} htmlFor="FN">FN</label>
                        <input onClick={() => setCheck((prev) => !prev)} type='radio' id="FN" name='session' value={"FN"} />
                    </span>
                    <span >
                        <label style={{ fontSize: "1em", color: "black" }} htmlFor="AN">AN</label>
                        <input onClick={() => setCheck((prev) => !prev)} type='radio' id="AN" name='session' value={"AN"} />
                    </span>
                </div>
                {faculty && <textarea onChange={(e) => setGlobalYear(e.target.value)} className={styles.textInput} placeholder='Select Year'></textarea>}
                {faculty && <textarea onChange={(e) => setGlobalSem(e.target.value)} className={styles.textInput} placeholder='Select Semester'></textarea>}
                {faculty && <textarea onChange={(e) => setGlobalRegulation(e.target.value)} className={styles.textInput} placeholder='Select Regulation'></textarea>}


                <div className={styles.session}>
                    <span>
                        <label style={{ fontSize: "1.5em", color: "black" }} htmlFor="FN">COE</label>
                        <input onChange={() => setRole("COE")} type='radio' id="COE" name='role' value={"COE"} />
                    </span>
                    <span>
                        <label style={{ fontSize: "1.5em", color: "black" }} htmlFor="AN">Principal</label>
                        <input onChange={() => setRole("Principal")} type='radio' id="principal" name='role' value={"Principal"} />
                    </span>
                    <span>
                        <label style={{ fontSize: "1.5em", color: "black" }} htmlFor="AN">Cheif Superintendent</label>
                        <input onChange={() => setRole("Chief")} type='radio' id="cheif" name='role' value={"Chief"} />
                    </span>
                </div>
                <div className={styles.timeSection}>
                    <span>
                        <label style={{ marginRight: "1em", fontSize: "1.4em", color: "black", fontWeight: "bolder" }} htmlFor="from">From</label>
                        <input id="from" type="time" />
                    </span>
                    <span>
                        <label style={{ marginRight: "1em", fontSize: "1.4em", color: "black", fontWeight: "bolder" }} htmlFor="to">To</label>
                        <input id="to" type="time" />
                    </span>
                </div>

                <label htmlFor='fileInput' className={styles.excelButton}>
                    <legend>Add an Excel to generate Seating</legend>
                    <input onChange={readFile} id='fileInput' type="file" accept='.csv , .xlsx , .xls' />
                </label>
                <button onClick={handleCapture} className={styles.actionButtons}>
                    Capture
                </button>

                <button onClick={handleSave} className={styles.actionButtons}>
                    Save PDF
                </button>

                {/* </span> */}
            </div>
            <div className={styles.contentView}>
                <div className={styles.pdf}>
                    {data.map((item, index) => {
                        const  from = document.getElementById("from") as HTMLInputElement
                        const  to = document.getElementById("to") as HTMLInputElement

                        // const fromTime = from.value
                        const toTime = to.value

                        // const fromDispTime = fromTime.split(":")[0] > 12 ? (fromTime.split(":")[0] - 12) + "

                        console.log(toTime.split(":"))

                        return (
                            <div id={"page" + index} className={styles.pdfPage}>
                                <img src={logo} alt="vbit logo" />
                                <h2 className={styles.plantitle}>SEATING PLAN</h2>
                                <p className={styles.exam}>B.Tech {globalYear} YEAR {globalSem} SEMESTER {globalRegulation} {examType} Examinations,{monthName(date) + " " + date.getFullYear()}</p>
                                <div className={styles.details}>
                                    <span className={styles.subList}>Subject:
                                        <p>&nbsp;{subList[index].join(",")}</p>

                                    </span>
                                    <span className={styles.subList}>Date: {date.toLocaleDateString("en-GB")}
                                        <p>Session: {parseInt(from.value.split(":")[0]) > 12 ? parseInt(from.value.split(":")[0]) - 12 + ":" + from.value.split(":")[1] : from.value + " "}&nbsp;{parseInt(from.value.split(":")[0]) > 12 ? "PM" : "AM"} - {parseInt(to.value.split(":")[0]) > 12 ? parseInt(to.value.split(":")[0]) - 12 + ":" + to.value.split(":")[1] : to.value} {parseInt(to.value.split(":")[0]) > 12 ? "PM" : "AM"}</p>
                                    </span>
                                    <span className={styles.subList}>Room:
                                        <p>&nbsp;{roomList[index]}</p>
                                    </span>
                                </div>
                                <div className={styles.table}>
                                    {
                                        item.map((subitem, subindex) => {
                                            const studentData = subitem.split(",");
                                            return (
                                                <span id={"" + subindex} className={styles.studentBlock}>
                                                    <span style={{ fontWeight: "bolder", fontSize: "1em", margin: "0" }}>{studentData[hallticket]}</span>
                                                    <span style={{ fontWeight: "bold", fontSize: "0.9em", margin: "0" }}>{
                                                        deptMappings[parseInt(studentData[dept])] + " - " + {globalYear} + "-" + {globalSem} + " Sem"}</span>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                                <span className={styles.specialNote}>Note: Cross the box containing the Hall Ticket number when candidate is absent</span>
                                <div className={styles.attendTable}>
                                    <span className={styles.attendHeader}>Total No.of Students</span>
                                    <span className={styles.attendHeader}>Total No.of Students Absent</span>
                                    <span className={styles.attendHeader}>Total No.of Students Present</span>
                                    <span className={styles.attendHeader}>{item.length}</span>
                                    <span className={styles.attendHeader}></span>
                                    <span className={styles.attendHeader}></span>
                                </div>

                                <div className={styles.signatures}>
                                    <span className={styles.signHeader}>Signature of the Invigilator</span>
                                    <span className={styles.signHeader}>Signature of the {roles[role]}</span>
                                </div>
                            </div>
                        )
                    })}

                    {facultyData.map((data, index) => {
                        console.log(data)
                        const from = document.getElementById("from") as HTMLInputElement;
                        const to = document.getElementById("to") as HTMLInputElement
                        return (
                            <div id={"page" + index} className={styles.pdfPage}>
                                <img src={logo} alt="vbit logo" />
                                <h2 className={styles.plantitle}>INVIGILATION PLAN</h2>
                                <p className={styles.exam}>B.Tech {globalYear} YEAR {globalSem} SEMESTER {globalRegulation} {examType} Examinations,{monthName(date) + " " + date.getFullYear()}</p>
                                <div className={styles.dateCont}>
                                    <span className={styles.date}>Date: {date.toLocaleDateString("en-GB")}</span>
                                    <p>Session: {parseInt(from.value.split(":")[0]) > 12 ? parseInt(from.value.split(":")[0]) - 12 + ":" + from.value.split(":")[1] : from.value + " "}&nbsp;{parseInt(from.value.split(":")[0]) > 12 ? "PM" : "AM"} - {parseInt(to.value.split(":")[0]) > 12 ? parseInt(to.value.split(":")[0]) - 12 + ":" + to.value.split(":")[1] : to.value} {parseInt(to.value.split(":")[0]) > 12 ? "PM" : "AM"}</p>
                                </div>

                                <div className={styles.facContainer}>
                                    <table className={styles.tableStyle}>
                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>S.no</div>
                                        </th>
                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>Faculty Name</div>
                                        </th>
                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>Room no.</div>
                                        </th>

                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>Entry Signature</div>
                                        </th>
                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>Total Scripts</div>
                                        </th>
                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>Scripts collected</div>
                                        </th>
                                        <th>
                                            <div className={styles.headItem} style={{ color: "black" }}>Exit Signature</div>
                                        </th>
                                        {
                                            data.map((item, index) => {
                                                const room = item.split(",")[1] === "" ? "N/A" : item.split(",")[1]
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div className={styles.gridItemIndex}>{index + 1}</div>
                                                        </td>
                                                        <td>
                                                            <div className={styles.gridItem1}>{item.split(",")[0]}</div>
                                                        </td>
                                                        <td>
                                                            <div className={styles.gridItem1}>{room}</div>
                                                        </td>
                                                        <td>
                                                            <div className={styles.hiddenDivs}>{'lkdjfkl'}</div>
                                                        </td>
                                                        <td>
                                                            <div className={styles.hiddenDivs}>{'lkdjfkl'}</div>
                                                        </td>
                                                        <td>
                                                            <div className={styles.hiddenDivs}>{'lkdjfkl'}</div>
                                                        </td>
                                                        <td>
                                                            <div className={styles.hiddenDivs}>{'lkdjfkl'}</div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </table>



                                </div>
                                <div style={{height:"100%",display:"flex",alignItems:"flex-end",marginBottom:"2em"}} className={styles.signatures}>
                                    <span className={styles.signHeader}>Signature of the Invigilator</span>
                                    <span className={styles.signHeader}>Signature of the {roles[role]}</span>
                                </div>
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default GeneralTab;