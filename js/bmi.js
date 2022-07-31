//設定dom
let bodyHeight = document.querySelector(".person-height");
let bodyWeight = document.querySelector(".person-weight");

let BMIresultBtnChange = document.querySelector(".count-btn");

//按鈕：清除數值按鈕
let resetBtn = document.querySelector(".reset-data");

//文字
let titleBMI = document.querySelector(".title-BMI");

//結果文字切換
let resultInnerWord = document.querySelector(".result-word");

//取出localStorage的值，並轉換型別為陣列
let BMIlocalStorageData = JSON.parse(localStorage.getItem('bmiItem')) || [];

//下方紀錄清單
let BMIrecordList = document.querySelector(".BMIRecordList"); 


//監聽事件
//開始計算BMI
BMIresultBtnChange.addEventListener("click", addBodyBMIData, false);
BMIrecordList.addEventListener("click",deleteOneList,false);

//清除input
resetBtn.addEventListener("click", resetData, false);


//function：計算BMI+儲存localStorage
function addBodyBMIData(e) {
  e.preventDefault(); //瀏覽預設行為做清除

  //取出input值
  let heightData = bodyHeight.value;
  let weightData = bodyWeight.value;
  let bodyState = "";//標註身體BMI狀態
  let bodyStateColor = "";

  //BMI運算結果
  let BMIresult = (weightData /(heightData * 0.01 * heightData * 0.01)).toFixed(2); //.toFixed(2) => 僅顯示到小數點後2位
  console.log("BMI值為" + BMIresult);

  //沒輸入任何數值時直接中斷function
  if (heightData === "" || weightData === "") {
    alert("請輸入相關數值");
    return; //中斷function
  }

  //按鈕樣式隨BMI動態變化
  titleBMI.style.display = "block"; //讓BMI小字出現(預設none)
  resetBtn.style.display = "block"; //讓重製按鈕出現(預設none)
  resultInnerWord.innerHTML = BMIresult;
  BMIresultBtnChange.classList.remove(".count-btn");


  if (BMIresult >= 40) {
    //重度肥胖
    bodyState = "重度肥胖";
    bodyStateColor="#FF1200";
    BMIresultBtnChange.classList.add("result-over-l-weight-btn");
    resetBtn.classList.add("over-l-weight-bg");

  } else if (40 > BMIresult && BMIresult >= 35) {
    // 中度肥胖
    bodyState = "中度肥胖";
    bodyStateColor="FF6C03";
    BMIresultBtnChange.classList.add("result-over-m-weight-btn");
    resetBtn.classList.add("over-m-weigh-bg");
  } else if (35 > BMIresult && BMIresult >= 30) {
    //輕度肥胖
    bodyState = "輕度肥胖";
    bodyStateColor="#ffa05d";
    BMIresultBtnChange.classList.add("result-over-s-weight-btn");
    resetBtn.classList.add("over-s-weight-bg");
  } else if (30 > BMIresult && BMIresult >= 25) {
    //過重
    bodyState = "過重";
    bodyStateColor="#ffca92";
    BMIresultBtnChange.classList.add("result-over-weight-btn");
    resetBtn.classList.add("over-weight-bg");
  } else if (25 > BMIresult && BMIresult >= 18.5) {
    //理想
    bodyState = "理想";
    bodyStateColor="#86D73F";
    BMIresultBtnChange.classList.add("result-btn");
    resetBtn.classList.add("perfect-body-bg");
  } else {
    // 過瘦
    bodyState = "過瘦";
    bodyStateColor="#31BAF9";
    BMIresultBtnChange.classList.add("result-over-thin-btn");
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

  BMIresultBtnChange.removeEventListener("click",addBodyBMIData, false);//移除click效果

}

//update Record List 新增資料在下方

function update(){
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
    <span class="fs-12px mr-8px">06-19-2017</span>
    <a href="#" class="material-symbols-outlined mr-8px p-8px"  data-recodeNum = ${i}> delete
    </a>
</li>`;
  }
  BMIrecordList.innerHTML = bmiDateRecordList;
}


//刪除單項紀錄
function deleteOneList(e){
    let deleteList = e.target.dataset.recodeNum;
    let nodeName = e.target.nodeName;//被點擊到的元素屬性
    // console.log(nodeName);
    if (nodeName !== "A"){ //如果被點擊到的元素不是<a>的話就停止function
        return;
    }

    BMIlocalStorageData.splice(deleteList,1);//刪除對象名稱deleteList，往後刪除數量為1
    
    update();//更新下方紀錄

    //重新setItem到localstorage內
    let BMIlocalStorageDataStr = JSON.stringify(BMIlocalStorageData);//getItem轉換型別為字串
    localStorage.setItem('bmiItem', BMIlocalStorageDataStr);//localStorage只能儲存字串

}



//清除與重置數值
function resetData(e) {
  bodyHeight.value = "";
  bodyWeight.value = "";
  // resetBtn.style.display = "none";
  // resetBtn.setAttribute("class", "material-symbols-outlined reset-data");
  // noData.style.display="block";
  // resultInnerWord.innerHTML = "看結果";
  BMIresultBtnChange.classList.add(".count-btn");
  BMIresultBtnChange.classList.remove("result-btn");
  BMIresultBtnChange.addEventListener("click", addBodyBMIData, false);
}

// 參考
// https://github.com/s9220140/BMI---homework/blob/main/js/all.js

// 1-修正刪除項目不對(刪除1會刪除到2)
// 2-修正按鈕效果:看結果和狀態可以重疊，現在是改樣式。
// 如果本身就是兩個不同的元件，就不會有第二次click的狀況？