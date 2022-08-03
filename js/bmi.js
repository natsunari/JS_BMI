//設定dom
let bodyHeight = document.querySelector(".person-height");
let bodyWeight = document.querySelector(".person-weight");

let BMICountBtnChange = document.querySelector(".count-btn");
let BMIreulstBtn = document.querySelector(".original-btn");

//按鈕：清除數值按鈕
let resetBtn = document.querySelector(".reset-data");

//結果文字切換
let resultInnerWord = document.querySelector(".result-word");

//取出localStorage的值，並轉換型別為陣列
let BMIlocalStorageData = JSON.parse(localStorage.getItem('bmiItem')) || [];

//下方紀錄清單
let BMIrecordList = document.querySelector(".BMIRecordList"); 


//監聽事件
//開始計算BMI
BMICountBtnChange.addEventListener("click", addBodyBMIData, false);
BMIrecordList.addEventListener("click",deleteOneList,false);

//清除input
resetBtn.addEventListener("click", resetData, false);


//function：計算BMI+儲存localStorage
function addBodyBMIData(e) {
  e.preventDefault(); //瀏覽預設行為做清除

  //按鈕樣式隨BMI動態變化
  BMICountBtnChange.style.display = "none";
  BMIreulstBtn.style.display = "inline-flex";
  resetBtn.style.display = "block"; //讓重製按鈕出現(預設none)
  
  //取出input值
  let heightData = bodyHeight.value;
  let weightData = bodyWeight.value;
  let bodyState = "";//標註身體BMI狀態
  let bodyStateColor = "";

  //沒輸入任何數值時直接中斷function
  if (heightData === "" || weightData === "") {
    alert("請輸入相關數值");
    return; //中斷function
  }

  //BMI運算結果
  let BMIresult = (weightData /(heightData * 0.01 * heightData * 0.01)).toFixed(2); //.toFixed(2) => 僅顯示到小數點後2位
  console.log("BMI值為" + BMIresult);
  resultInnerWord.innerHTML = BMIresult;


  if (BMIresult >= 40) {
    //重度肥胖
    bodyState = "重度肥胖";
    bodyStateColor="#FF1200";
    BMIreulstBtn.classList.add("result-over-l-weight-btn");
    resetBtn.classList.add("over-l-weight-bg");

  } else if (40 > BMIresult && BMIresult >= 35) {
    // 中度肥胖
    bodyState = "中度肥胖";
    bodyStateColor = "#FF6C03";
    BMIreulstBtn.classList.add("result-over-m-weight-btn");
    resetBtn.classList.add("over-m-weigh-bg");
  } else if (35 > BMIresult && BMIresult >= 30) {
    //輕度肥胖
    bodyState = "輕度肥胖";
    bodyStateColor = "#ffa05d";
    BMIreulstBtn.classList.add("result-over-s-weight-btn");
    resetBtn.classList.add("over-s-weight-bg");
  } else if (30 > BMIresult && BMIresult >= 25) {
    //過重
    bodyState = "過重";
    bodyStateColor = "#ffca92";
    BMIreulstBtn.classList.add("result-over-weight-btn");
    resetBtn.classList.add("over-weight-bg");
  } else if (25 > BMIresult && BMIresult >= 18.5) {
    //理想
    bodyState = "理想";
    bodyStateColor = "#86D73F";
    BMIreulstBtn.classList.add("result-normal-btn");
    resetBtn.classList.add("normal-body-bg");
  } else {
    // 過瘦
    bodyState = "過瘦";
    bodyStateColor = "#31BAF9";
    BMIreulstBtn.classList.add("result-over-thin-btn");
    resetBtn.classList.add("over-thin-bg");
  }

  // 儲存到localStorage
  // 先設計localstorge的資料格式
  let bmiDetailData = {
    height: heightData,
    weight: weightData,
    BMI: BMIresult,
    state: bodyState,
    stateColor:bodyStateColor,
  };

  BMIlocalStorageData.push(bmiDetailData);//將對應的bmiDetailData數值push到BMIlocalStorageData內
  let BMIlocalStorageDataStr = JSON.stringify(BMIlocalStorageData);//getItem轉換型別為字串
  localStorage.setItem('bmiItem', BMIlocalStorageDataStr);//localStorage只能儲存字串

  update();

}

//update Record List 新增資料在下方

function update(){
  //時間設定
  let date = new Date();
  let showDate = date.toISOString().split('T')[0];
  let bmiDateRecordList = "";//先設定空的字串，預計放入for迴圈的li
  for(let i=0; i < BMIlocalStorageData.length ; i++){
    // console.log('update');
    bmiDateRecordList +=`<li class="flex flex-aic flex-jcsb bmi-record-card mb-16">
    <span class="bmi-mark" style="background-color: ${BMIlocalStorageData[i].stateColor};"></span>
    <p class="ptb-20px fs-20px">${BMIlocalStorageData[i].state}</p>
    <span class="fs-12px ml-30px mr-8px">BMI</span>
    <p class="fs-20px mr-42px">${BMIlocalStorageData[i].BMI}</p>
    <span class="fs-12px mr-8px">height</span>
    <p class="fs-20px mr-42px">${BMIlocalStorageData[i].height+"cm"}</p>
    <span class="fs-12px mr-8px">weight</span>
    <p class="fs-20px mr-42px">${BMIlocalStorageData[i].weight+"kg"}</p>
    <span class="fs-12px mr-8px">${showDate}</span>
    <a href="#" class="material-symbols-outlined mr-8px p-8px" data-recodeListNum = ${i}> delete
    </a>
</li>`;
  }
  BMIrecordList.innerHTML = bmiDateRecordList;
}


//刪除單項紀錄
function deleteOneList(e){
    let deleListItem = e.target.dataset.recodelistnum;//注意html與js大小寫轉換問題
    let nodeName = e.target.nodeName;//被點擊到的元素屬性
    
    if (nodeName !== "A"){ //如果被點擊到的元素不是<a>的話就停止function
        return;
    }

    BMIlocalStorageData.splice(deleListItem,1);//刪除對象名稱deleteList，往後刪除數量為1
    
    update();//更新下方紀錄

    //重新setItem到localstorage內
    let BMIlocalStorageDataStr = JSON.stringify(BMIlocalStorageData);//getItem轉換型別為字串
    localStorage.setItem('bmiItem', BMIlocalStorageDataStr);//localStorage只能儲存字串

}


//清除與重置數值
function resetData(e) {
  bodyHeight.value = "";//清空input value
  bodyWeight.value = "";//清空input value
  resultInnerWord.innerHTML = "";//清空input value
  BMIreulstBtn.classList.remove("result-over-l-weight-btn","result-over-m-weight-btn","result-over-s-weight-btn","result-over-weight-btn","result-normal-btn","result-over-thin-btn");
  BMIreulstBtn.style.display = "none";
  resetBtn.classList.remove("over-l-weight-bg","over-m-weight-bg","over-s-weight-bg","over-weight-bg","normal-body-bg","over-thin-bg");
  resetBtn.style.display = "none";
  BMICountBtnChange.style.display = "inline-flex";
}
