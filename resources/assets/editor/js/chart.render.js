var chartMinHeight = 200;
//渲染图表
var currentDoc;
var chartMap = {};
function renderChart(doc) {
    currentDoc = doc;
    $(doc).find("div[module='chart']").each(function() {
        var type = $(this).attr("type");
        var data = $(this).attr("data");
        var id = $(this).attr("id");
        try {
            data = decodeURIComponent(atob(data));
            data = JSON.parse(data);
        } catch(e) {}
        switch (type) {
            case "clazzJob" :
                renderMissionPointDiv(id, data);
                break;
            case "clazzActive" :
                renderClassActiveDiv(id, data);
                break;
            case "clazzChapter-CompletionRate" :
                renderCompletionRateDiv(id, data);
                break;
            case "goalCompletionRate" :
                renderGoalCompletionRateDiv(id, data)
                break;
            case "courseCompositeScore" :
                renderCourseCompositeScoreDiv(id, data);
                break;
            case "classScore-CompletionRate" :
                renderClassScoreChartDiv(id, data);
                break;
            case "classScoreProportion" :
                renderClassScoreProportionDiv(id, data);
                break;
            case "studyResource" :
                renderStudyResourceDiv(id, data);
                break;
            case "studyOnlineTrend" :
                renderStudyOnlineTrendDiv(id, data);
                break;
            case "studyOnlineAnalyse" :
                renderStudyOnlineAnalyseDiv(id, data);
                break;
            case "chapterJobFinish" :
                renderChapterJobFinishDiv(id, data);
                break;
            case "testScore" :
                renderTestScoreDiv(id, data);
                break;
            case "signlist" :
                renderSignlistDiv(id, data);
                break;
            case "workScore" :
                renderWorkScoreDiv(id, data);
                break;
            case "examScore" :
                renderExamScoreDiv(id, data);
                break;
            case "teacherBBS" :
                renderTeacherBBSDiv(id, data);
                break;
            case "studentBBS" :
                renderStudentBBSDiv(id, data);
                break;
            case "clazzTarget" :
                renderClazzTargetDiv(id, data);
                break;
            case "score" :
                renderScoreDiv(id, data);
                break;
            case "STU_SCORE_FREQUENCY" :
            case "STU_SCORE_PERCENTILE" :
                //学生成绩频度分布图
                xxcjZhutu(id, data);
                break;
            case "NORMAL_DISTRIBUTION" :
                //学生成绩正态分布图
                xxcjXiantu(id, data);
                break;

        }
    });
}

/*创建横向条形图*/
function renderMissionPointDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    //x轴数据
    var xDataArr = [];
    //y轴数据
    var yDataArr = [];
    var num = 0;
    data.forEach(function(item) {
        xDataArr.push(item.clazzName);
        yDataArr.push(item.avgFinish * 100);
        num++;
    });
    var height = ((num * 30 + 90) > chartMinHeight) ? (data.length * 30 + 90 + "px") : (chartMinHeight+"px");
    $('#'+id).css("height", height);
    var mEcharts = echarts.init(currentDoc.getElementById(id));
    var option = {
        tooltip:{
            show:true,
        },
        yAxis: {
            type: 'category',
            data: xDataArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}(%)"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        grid: {
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        series: [{
            data: yDataArr,
            name: '各班学习情况',
            type: 'bar',
            /*每条圆柱样式 */
            barWidth: '10',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            },

            labelLayout: {}
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

/*创建课堂活动横向条形图*/
function renderClassActiveDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    //console.log(id,data)
    //x轴数据
    var xDataArr = [];
    //y轴数据
    var yDataArr = [];
    var num = 0;
    data.forEach(function(item) {
        if(item.studentNum && item.signNum) {
            xDataArr.push(item.clazzName);
            yDataArr.push(item.signJoinNum / (item.studentNum * item.signNum) * 100);
            num++;
        }
    });
    //console.log(xDataArr,yDataArr)
    var height = ((num * 30 + 90) > chartMinHeight) ? (num * 30 + 90 + "px") : (chartMinHeight+"px");
    $('#'+id).css("height", height);
    var mEcharts = echarts.init(currentDoc.getElementById(id));
    var option = {
        tooltip:{
            show:true,
        },
        yAxis: {
            type: 'category',
            data: xDataArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}(%)"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        grid: {
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        series: [{
            data: yDataArr,
            name: '任务点平均完成率',
            type: 'bar',
            /*每条圆柱样式 */
            barWidth: '10',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            },

            labelLayout: {}
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

/*班级章节测验、作业、考试平均完成率对比图*/
function renderCompletionRateDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    var classNameArr = [];
    var avgChapterFinishArr = [];
    var avgWorkFinishArr = [];
    var avgExamFinishArr = [];
    var num = 0;
    data.forEach(function(item) {
        classNameArr.push(item.clazzName);
        avgChapterFinishArr.push(item.avgChapterFinish);
        avgWorkFinishArr.push(item.avgWorkFinish);
        avgExamFinishArr.push(item.avgExamFinish);
        num++;
    });
    var height = ((num * 50 + 90) > chartMinHeight) ? (num * 50 + 90 + "px") : (chartMinHeight+"px");
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: height});
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        legend: {
            bottom: "0",
            data: ['章节测验完成率', '作业完成率', '考试完成率']
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}%"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        yAxis: {
            type: 'category',
            data: classNameArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series:[{
            name: "章节测验完成率",
            type: 'bar',
            data: avgChapterFinishArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            }
        }, {
            name: "作业完成率",
            type: 'bar',
            data: avgWorkFinishArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(159, 230, 184, 1)",
                borderRadius: 6
            }
        }, {
            name: "考试完成率",
            type: 'bar',
            data: avgExamFinishArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(254, 159, 127, 1)",
                borderRadius: 6
            }
        }]
    }
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

/*课程目标完成率图*/
function renderGoalCompletionRateDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    var classNameArr = [];
    var avgChapterFinishArr = [];
    var avgWorkFinishArr = [];
    var avgExamFinishArr = [];
    var num = 0;
    var maxNum = 0;
    var goalArr = [[],[],[],[],[],[],[],[],[],[],[]];
    var dataArr = [];
    var types = ["#61A2FF","#B2EBC6","#FEB299","#C4AAF2"];
    var nameArr = [];
    data.forEach(function(item,index) {
        if(index == 0){
            if(item.proficiency != "" && item.proficiency.name && item.proficiency.name.length > 0){
                nameArr = item.proficiency.name;
            }
        }
        classNameArr.push(item.clazzName);
        var proficiency = item.proficiency || '';
        if(proficiency != "" && proficiency.ad && proficiency.ad.length > 0){
            for(var i=0;i<proficiency.ad.length;i++){
                goalArr[i].push(proficiency.ad[i])
            }

            maxNum = (maxNum < proficiency.ad.length) ? proficiency.ad.length : maxNum;
        }
        num++;
    });

    if(maxNum == 0)
        return;
    for(var j=0;j<maxNum;j++){
        var obj = {
            name: '',
            type: 'bar',
            data: '',
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            }
        }
        var name = '';
        if(nameArr[j].length > 10){
            name = nameArr[j].substring(0,10)+'...';
        }else{
            name = nameArr[j];
        }
        obj.name = name || '';
        obj.data = goalArr[j];
        obj.itemStyle.color = types[j];
        dataArr.push(obj);
    }
    var barHeight = (15 * maxNum > 50) ? (15 * maxNum) : 50;
    var height = ((num * barHeight + 90) > chartMinHeight) ? (num * barHeight + 90 + "px") : (chartMinHeight+"px");
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: height});
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        legend: {
            bottom: '0',
            left: 'center',
        },
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        yAxis: {
            type: 'category',
            data: classNameArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series:dataArr
    }
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

/*渲染课程综合成绩分布图*/
function renderCourseCompositeScoreDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    //x轴数据
    var xDataArr = [];
    data.range.forEach(function(item, index) {
        var obj = {};
        obj.value = item.doc_count;
        switch(index) {
            case 0:
                obj.name = "0分";
                obj.itemStyle = {
                    normal: {
                        color: "#C4AAF2"
                    }
                }
                break;
            case 1:
                obj.name = "1-59分";
                obj.itemStyle = {
                    normal: {
                        color: "#FEB299"
                    }
                }
                break;
            case 2:
                obj.name = "60-79分";
                obj.itemStyle = {
                    normal: {
                        color: "#B2EBC6"
                    }
                }
                break;
            case 3:
                obj.name = "80-100分";
                obj.itemStyle = {
                    normal: {
                        color: "#61A2FF"
                    }
                }
                break;
            default:
                obj.name = "";
        }
        xDataArr.push(obj);
    });
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

/*班级综合成绩分布图*/
function renderClassScoreChartDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    var _option;

    //console.log(id,data)
    var classNameArr = [];
    var studentNumArr = [];
    var minArr = [];
    var maxArr = [];
    var avgArr = [];
    var num = 0;
    data.forEach(function(item) {
        classNameArr.push(item.clazzName);
        studentNumArr.push(item.studentNum);
        minArr.push(item.min);
        maxArr.push(item.max);
        avgArr.push(item.avg);
        num++;
    });

    var height = ((num * 50 + 90) > chartMinHeight) ? (num * 50 + 90 + "px") : (chartMinHeight+"px");

    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {
        height: height
    });
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        legend: {
            bottom: "0",
            data: ['最高分', '平均分', '最低分']
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        yAxis: {
            type: 'category',
            data: classNameArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series:[{
            name: "最高分",
            type: 'bar',
            data: maxArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            }
        }, {
            name: "平均分",
            type: 'bar',
            data: avgArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(159, 230, 184, 1)",
                borderRadius: 6
            }
        }, {
            name: "最低分",
            type: 'bar',
            data: minArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(254, 159, 127, 1)",
                borderRadius: 6
            }
        }]
    }
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

/*渲染班级各分数段人数百分占比图*/
function renderClassScoreProportionDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    //x轴数据
    var xDataArr = [];
    var classNameArr = [];
    var num = 0;
    var types = [{
        name: "0分",
        type: "bar",
        stack: "total",
        /*每条圆柱样式 */
        barWidth: '10',
        data: [],
        itemStyle: {
            normal: {
                color: "#C4AAF2"
            }
        }
    },
        {
            name: "1-59分",
            type: "bar",
            stack: "total",
            /*每条圆柱样式 */
            barWidth: '10',
            data: [],
            itemStyle: {
                normal: {
                    color: "#FEB299"
                }
            }
        },
        {
            name: "60-79分",
            type: "bar",
            stack: "total",
            /*每条圆柱样式 */
            barWidth: '10',
            data: [],
            itemStyle: {
                normal: {
                    color: "#B2EBC6"
                }
            }
        },
        {
            name: "80-100分",
            type: "bar",
            stack: "total",
            /*每条圆柱样式 */
            barWidth: '10',
            data: [],
            itemStyle: {
                normal: {
                    color: "#61A2FF"
                }
            }
        },
    ]
    data.forEach(function(item, index) {
        var studentNum = item.studentNum || 0;
        if(studentNum > 0) {
            classNameArr.push(item.clazzName);
            types[0].data.push((item.range[0].doc_count / studentNum * 100).toFixed(2));
            types[1].data.push((item.range[1].doc_count / studentNum * 100).toFixed(2));
            types[2].data.push((item.range[2].doc_count / studentNum * 100).toFixed(2));
            types[3].data.push((item.range[3].doc_count / studentNum * 100).toFixed(2));
            num++;
        }

    });
    var height = ((num * 30 + 90) > chartMinHeight) ? (num * 30 + 90 + "px") : (chartMinHeight+"px");
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {
        height: height
    });
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '0',
            left: 'center',
            data: ['0分', '1-59分', '60-79分', '80-100分']
        },
        grid: {
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}%"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        yAxis: {
            type: 'category',
            data: classNameArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series: types
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function _defineProperty(obj, key, value) {
    if(key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function renderStudyResourceDiv(id, data) {
    if(undefined == data || data.length<=0)
        return;
    //x轴数据
    var xDataArr = [];
    var jobCount = data.jobCount || 0;
    var audiojobcount = data.audiojobcount || 0;
    var videojobcount = data.videojobcount || 0;
    var bookjobcount = data.bookjobcount || 0;
    var microcoursejobcount = data.microcoursejobcount || 0;
    var docjobcount = data.docjobcount || 0;
    var workjobcount = data.workjobcount || 0;
    var otherjobcount = data.otherjobcount || 0;
    var colors = ['#3A8BFF', '#9FE6B8','#FE9F7F','#C9AAF2','#6CB3D9','#B8E1A1','#FFC16D'];
    var xDataArr = [{
        name: "视频",
        value: videojobcount,
    }, {
        name: "章节测验",
        value:workjobcount,
    }, {
        name: "文档",
        value:docjobcount,
    }, {
        name: "音频",
        value:audiojobcount,
    }, {
        name: "图书",
        value:bookjobcount,
    }, {
        name: "速课",
        value:microcoursejobcount,
    }, {
        name: "	其他（阅读、直播）",
        value:otherjobcount,
    }]

    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        color:colors,
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}


function renderStudyOnlineTrendDiv(id, data) {
    if(undefined == data || data.length<=0)
        return;
    var count = data.count || 0;
    //x轴数据
    var xDataArr = [];
    var yDataArr = [];
    var monthArr = data.month;
    if(undefined == monthArr||$.trim(monthArr)=='')
        return;
    var num = 0;
    for (var index in monthArr) {
        xDataArr.push(index);
        yDataArr.push(monthArr[index]);
        num ++;
    }

    var height = ((num * 35 + 90) > chartMinHeight) ? (num * 35 + 90 + "px") : (chartMinHeight+"px");

    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {
        height: height
    });
    var colors = ['#3A8BFF', '#9FE6B8','#FE9F7F','#C9AAF2','#6CB3D9','#B8E1A1','#FFC16D'];
    var option = {
        color: colors,
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xDataArr,
            axisLine: {
                onZero: false,
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        yAxis: {
            type: 'value',
            offset: 10, //相对默认位置偏移量
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series: [{
            data: yDataArr,
            type: 'line',
            smooth: true
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}


function renderStudyOnlineAnalyseDiv(id, data) {
    if(undefined == data || data.length<=0)
        return;
    var _option;
    var week = data.week || {};
    var week1 = [];
    var week2 = [];
    var week3 = [];
    var week4 = [];
    var week5 = [];
    var week6 = [];
    var week7 = [];
    var num = 7;
    var range1 = [];
    var range2 = [];
    var range3 = [];
    var range4 = [];
    var range5 = [];
    var range6 = [];
    for (var index in week) {
        switch(index.substring(0,1)) {
            case '1':
                week1.push(week[index]);
                break;
            case '2':
                week2.push(week[index]);
                break;
            case '3':
                week3.push(week[index]);
                break;
            case '4':
                week4.push(week[index]);
                break;
            case '5':
                week5.push(week[index]);
                break;
            case '6':
                week6.push(week[index]);
                break;
            case '7':
                week7.push(week[index]);
                break;
        }
    };
    for(var i=0;i<week1.length;i++){
        if(i == 0){
            range1.push(week1[i]);
            range1.push(week2[i]);
            range1.push(week3[i]);
            range1.push(week4[i]);
            range1.push(week5[i]);
            range1.push(week6[i]);
            range1.push(week7[i]);
        }else if(i == 1){
            range2.push(week1[i]);
            range2.push(week2[i]);
            range2.push(week3[i]);
            range2.push(week4[i]);
            range2.push(week5[i]);
            range2.push(week6[i]);
            range2.push(week7[i]);
        }else if(i == 2){
            range3.push(week1[i]);
            range3.push(week2[i]);
            range3.push(week3[i]);
            range3.push(week4[i]);
            range3.push(week5[i]);
            range3.push(week6[i]);
            range3.push(week7[i]);
        }else if(i == 3){
            range4.push(week1[i]);
            range4.push(week2[i]);
            range4.push(week3[i]);
            range4.push(week4[i]);
            range4.push(week5[i]);
            range4.push(week6[i]);
            range4.push(week7[i]);
        }else if(i == 4){
            range5.push(week1[i]);
            range5.push(week2[i]);
            range5.push(week3[i]);
            range5.push(week4[i]);
            range5.push(week5[i]);
            range5.push(week6[i]);
            range5.push(week7[i]);
        }else if(i == 5){
            range6.push(week1[i]);
            range6.push(week2[i]);
            range6.push(week3[i]);
            range6.push(week4[i]);
            range6.push(week5[i]);
            range6.push(week6[i]);
            range6.push(week7[i]);
        }
    }
    var height = ((num * 35 + 90) > chartMinHeight) ? (num * 35 + 90 + "px") : (chartMinHeight+"px");

    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {
        height: height
    });
    var colors = ['#3A8BFF', '#9FE6B8','#FE9F7F','#C9AAF2','#6CB3D9','#B8E1A1','#FFC16D'];
    var option = {
        color:colors,
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }

        },
        yAxis: {
            type: 'value',
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series:[{
            name: "0～4点",
            type: 'bar',
            stack: "total",
            data: range1,
            /*每条圆柱样式 */
            barWidth: '28',

        },{
            name: "4～8点",
            type: 'bar',
            stack: "total",
            data: range2,
            /*每条圆柱样式 */
            barWidth: '28',

        },{
            name: "8～12点",
            type: 'bar',
            stack: "total",
            data: range3,
            /*每条圆柱样式 */
            barWidth: '28',

        },{
            name: "12～16点",
            type: 'bar',
            stack: "total",
            data: range4,
            /*每条圆柱样式 */
            barWidth: '28',

        },{
            name: "16～20点",
            type: 'bar',
            stack: "total",
            data: range5,
            /*每条圆柱样式 */
            barWidth: '28',

        },{
            name: "20～24点",
            type: 'bar',
            stack: "total",
            data: range6,
            /*每条圆柱样式 */
            barWidth: '28',

        }]
    }
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function renderChapterJobFinishDiv(id, data) {
    if(undefined == data || data.length<=0)
        return;
    //x轴数据
    var xDataArr = ['最慢进度','平均进度','最快进度'];
    var min = data.min || 0;
    var avg = data.avg || 0;
    var max = data.max || 0;
    //y轴数据
    var yDataArr = [min,avg,max];
    var num = 3;

    var height = ((num * 30 + 90) > chartMinHeight) ? (num * 30 + 90 + "px") : (chartMinHeight+"px");
    $('#'+id).css("height", height);
    var mEcharts = echarts.init(currentDoc.getElementById(id));
    var colors = ['#3A8BFF', '#9FE6B8','#FE9F7F','#C9AAF2','#6CB3D9','#B8E1A1','#FFC16D'];
    var option = {
        color:colors,
        tooltip:{
            show:true,
        },
        yAxis: {
            type: 'category',
            data: xDataArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        grid: {
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        series: [{
            data: yDataArr,
            name: '',
            type: 'bar',
            /*每条圆柱样式 */
            barWidth: '10',
            itemStyle: {
                borderRadius: 6
            },

            labelLayout: {}
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}


function renderTestScoreDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    //x轴数据
    var xDataArr = [];
    var arr = data.scoreObj.array;
    if(undefined == arr||$.trim(arr)=='')
        return;
    arr.forEach(function(item, index) {
        var obj = {};
        obj.value = item.value;
        switch(index) {
            case 0:
                obj.name = "80-100分";
                obj.itemStyle = {
                    normal: {
                        color: "#61A2FF"
                    }
                }
                break;
            case 1:
                obj.name = "60-79分";
                obj.itemStyle = {
                    normal: {
                        color: "#B2EBC6"
                    }
                }
                break;
            case 2:
                obj.name = "1-59分";
                obj.itemStyle = {
                    normal: {
                        color: "#FEB299"
                    }
                }
                break;
            case 3:
                obj.name = "未获得分数";
                obj.itemStyle = {
                    normal: {
                        color: "#C4AAF2"
                    }
                }
                break;
            default:
                obj.name = "";
        }
        xDataArr.push(obj);
    });
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function renderSignlistDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    var count = data.count || 0;
    //x轴数据
    var xDataArr = data.signlist.date || [];
    var yDataArr = [];
    var rateArr = data.signlist.rate;
    if(undefined == rateArr||$.trim(rateArr)=='')
        return;
    rateArr.forEach(function(item, index) {
        yDataArr.push(item * 100)
    })
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var colors = ['#3A8BFF', '#9FE6B8','#FE9F7F','#C9AAF2','#6CB3D9','#B8E1A1','#FFC16D'];
    var option = {
        color: colors,
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xDataArr,
            axisLine: {
                onZero: false,
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        yAxis: {
            type: 'value',
            offset: 10, //相对默认位置偏移量
            axisLabel: {
                color: "rgba(138, 139, 153, 1)",
                formatter: "{value}%"
            }
        },
        series: [{
            data: yDataArr,
            type: 'line',
            smooth: true
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function renderWorkScoreDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    //x轴数据
    var xDataArr = [];
    var arr = data.scoreObj.array;
    if(undefined == arr||$.trim(arr)=='')
        return;
    arr.forEach(function(item, index) {
        var obj = {};
        obj.value = item.value;
        switch(index) {
            case 0:
                obj.name = "1-59分";
                obj.itemStyle = {
                    normal: {
                        color: "#FEB299"
                    }
                }
                break;
            case 1:
                obj.name = "60-79分";
                obj.itemStyle = {
                    normal: {
                        color: "#B2EBC6"
                    }
                }
                break;
            case 2:
                obj.name = "80-100分";
                obj.itemStyle = {
                    normal: {
                        color: "#61A2FF"
                    }
                }
                break;
            case 3:
                obj.name = "未获得分数";
                obj.itemStyle = {
                    normal: {
                        color: "#C4AAF2"
                    }
                }
                break;
            default:
                obj.name = "";
        }
        xDataArr.push(obj);
    });
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function renderExamScoreDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    //x轴数据
    var xDataArr = [];
    var arr = data.scoreObj.array;
    if(undefined == arr||$.trim(arr)=='')
        return;
    arr.forEach(function(item, index) {
        var obj = {};
        obj.value = item.value;
        switch(index) {
            case 0:
                obj.name = "1-59分";
                obj.itemStyle = {
                    normal: {
                        color: "#FEB299"
                    }
                }
                break;
            case 1:
                obj.name = "60-79分";
                obj.itemStyle = {
                    normal: {
                        color: "#B2EBC6"
                    }
                }
                break;
            case 2:
                obj.name = "80-100分";
                obj.itemStyle = {
                    normal: {
                        color: "#61A2FF"
                    }
                }
                break;
            case 3:
                obj.name = "未获得分数";
                obj.itemStyle = {
                    normal: {
                        color: "#C4AAF2"
                    }
                }
                break;
            default:
                obj.name = "";
        }
        xDataArr.push(obj);
    });
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function renderTeacherBBSDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    var _option;

    var replyArr = [];
    var publishArr = [];
    var classNameArr = [];
    var num = 0;
    data.teacherList.forEach(function(item) {
        replyArr.push(item.reply_discuss_num);
        publishArr.push(item.publish_discuss_num);
        classNameArr.push(item.username);
        num++;
    });

    var height = ((num * 30 + 90) > chartMinHeight) ? (num * 30 + 90 + "px") : (chartMinHeight+"px");

    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {
        height: height
    });
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        legend: {
            bottom: "0",
            data: ['发表话题', '回复话题']
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        yAxis: {
            type: 'category',
            data: classNameArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series:[{
            name: "发表话题",
            type: 'bar',
            stack: "total",
            data: publishArr,
            /*每条圆柱样式 */
            barWidth: '10',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            }
        }, {
            name: "回复话题",
            type: 'bar',
            stack: "total",
            data: replyArr,
            /*每条圆柱样式 */
            barWidth: '10',
            itemStyle: {
                color: "rgba(159, 230, 184, 1)",
                borderRadius: 6
            }
        }]
    }
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}
function renderClazzTargetDiv(id, data) {
    if(undefined == data||$.trim(data)==''|| data.length<=0)
        return;
    var total = data.total || 0;
    if(total == 0 || data.data.length == 0)
        return;
    var nameArr = [];
    var avgArr = [];
    var maxArr = [];
    var minArr = [];
    var num = 0;
    data.data.forEach(function(item) {
        var name = item.name;
		if(name.length > 10){
			name = name.substring(0,10)+'...';
		}
		nameArr.push(name);
		avgArr.push(item.avg);
		maxArr.push(item.max);
		minArr.push(item.min);
		num++;
    });
    var height = ((num * 50 + 90) > chartMinHeight) ? (num * 50 + 90 + "px") : (chartMinHeight+"px");
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: height});
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        grid:{
            left: 10,
            top: 10,
            bottom: 40,
            width: '90%',
            height: 'auto',
            containLabel: true
        },
        legend: {
            bottom: "0",
            data: ['最高达成度', '平均达成度', '最低达成度']
        },
        xAxis: {
            type: 'value',
            //设置横坐标单位为 w
            axisLabel: {
                formatter: "{value}"
            },
            splitLine: {
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                },
                show: true
            }

        },
        yAxis: {
            type: 'category',
            data: nameArr,
            offset: 10, //相对默认位置偏移量
            nameTextStyle: { //类目轴样式
                color: "rgba(138, 139, 153, 1)",
                fontSize: 12,
                lineHeight: 14
            },
            axisTick: {
                length: 6
            },
            axisLine:{ //坐标轴刻度
                lineStyle: {
                    width: 1,
                    color: 'rgba(218, 228, 242, 1)'
                }
            },
            axisLabel: {
                color: "rgba(138, 139, 153, 1)"
            }
        },
        series:[{
            name: "最高达成度",
            type: 'bar',
            data: maxArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(58, 139, 255, 1)",
                borderRadius: 6
            }
        }, {
            name: "平均达成度",
            type: 'bar',
            data: avgArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(159, 230, 184, 1)",
                borderRadius: 6
            }
        }, {
            name: "最低达成度",
            type: 'bar',
            data: minArr,
            /*每条圆柱样式 */
            barWidth: '8',
            itemStyle: {
                color: "rgba(254, 159, 127, 1)",
                borderRadius: 6
            }
        }]
    }
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}
function renderStudentBBSDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    //x轴数据
    var xDataArr = [];
    var publish_discuss_num = data.publish_discuss_num || 0;
    var reply_discuss_num = data.reply_discuss_num || 0;
    var xDataArr = [{
        name: "发表话题数",
        value: publish_discuss_num,
        itemStyle: {
            color: "rgba(58, 139, 255, 1)",
        }
    }, {
        name: "回复话题数",
        value:reply_discuss_num,
        itemStyle: {
            color: "rgba(159, 230, 184, 1)",
        }
    }]

    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

function renderScoreDiv(id, data) {
    if(undefined == data||$.trim(data)=='')
        return;
    //x轴数据
    var xDataArr = [];
    var arr = data.array;
    if(undefined == arr||$.trim(arr)=='')
        return;
    arr.forEach(function(item, index) {
        var obj = {};
        obj.value = item.value;
        switch(index) {
            case 0:
                obj.name = "0分";
                obj.itemStyle = {
                    normal: {
                        color: "#C4AAF2"
                    }
                }
                break;
            case 1:
                obj.name = "1-59分";
                obj.itemStyle = {
                    normal: {
                        color: "#FEB299"
                    }
                }
                break;
            case 2:
                obj.name = "60-79分";
                obj.itemStyle = {
                    normal: {
                        color: "#B2EBC6"
                    }
                }
                break;
            case 3:
                obj.name = "80-100分";
                obj.itemStyle = {
                    normal: {
                        color: "#61A2FF"
                    }
                }
                break;
            default:
                obj.name = "";
        }
        xDataArr.push(obj);
    });
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: xDataArr
        }]
    };
    mEcharts.setOption(option);
    chartMap[id] = mEcharts;
}

//学生成绩频度分布图
function xxcjZhutu(id,data){
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "300"});
    var optionA = {
        tooltip:{
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{b}：{c}人',
        },
        grid: {
            top:'12%',
            left: '5%',
            right: '5%',
            bottom: '6%',
            containLabel: true
        },
        xAxis: [
            {
                type : 'category',
                data : (function () {
                    var arr = []
                    for (var t = 0; t < data.length; t++) {
                        arr.push(data[t].value)
                    }
                    return arr
                })(),
                axisLabel: {
                    rotate:45,
                    textStyle:{
                        color:'#A8A8B3',
                        fontSize:12
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true,
                },
                splitLine:{
                    show: false,
                    lineStyle : {
                        color:'rgba(39,125,255,0.10)',
                        type:'dashed',
                    }
                },
            }
        ],
        yAxis:[
            {
                type: 'value',
                name:'（人）',
                nameGap:10,
                nameTextStyle:{
                    color:'#A8A8B3',
                    fontSize:12,
                    padding:[0,0,-6,-26],
                },
                axisLabel: {
                    textStyle:{
                        color:'#A8A8B3',
                        fontSize:12
                    },
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true,
                },
                splitLine:{
                    show: true,
                    lineStyle : {
                        color:'rgba(39,125,255,0.10)',
                        type:'dashed',
                    }
                },
            }
        ],
        series: [{
            name:'学生成绩',
            type:'bar',
            barWidth:10,
            data : (function () {
                var arr = []
                for (var t = 0; t < data.length; t++) {
                    arr.push(data[t].name)
                }
                return arr
            })(),
            itemStyle:{
                normal:{
                    barBorderRadius:2,
                    color:'#398CFF',
                }
            },
        }],

    }
    mEcharts.setOption(optionA,true);
    chartMap[id] = mEcharts;
}

//学生成绩正态分布图
function xxcjXiantu(id,data){
    var mEcharts = echarts.init(currentDoc.getElementById(id), null, {height: "250"});
    var optionA = {
        tooltip:{
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:function(params){
                //      	console.log(params)
                return	params[1].marker + '方差' + '：' + params[1].value + '<br/>' +
                    params[0].marker + params[0].seriesName + '：' + params[0].value
            }
        },
        legend: {
            data: ['人数', '正态分布（方差）'],
            icon:'roundRect',
            itemGap:30,
            itemWidth:14,
            itemHeight:14,
            textStyle:{
                fontSize:14,
                color:'#98A0AA',
            },
            x:'5%',
            y:'5%',
        },
        grid: {
            top:'25%',
            left: '5%',
            right: '5%',
            bottom: '6%',
            containLabel: true
        },
        xAxis: [
            {
                type : 'category',
                data : (function () {
                    var arr = []
                    for (var t = 0; t < data.length; t++) {
                        arr.push(data[t].name)
                    }
                    return arr
                })(),
                axisLabel: {
                    textStyle:{
                        color:'#A8A8B3',
                        fontSize:12
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true,
                },
                splitLine:{
                    show: false,
                    lineStyle : {
                        color:'rgba(39,125,255,0.10)',
                        type:'dashed',
                    }
                },
            }
        ],
        yAxis:[
            {
                type: 'value',
                name:'（方差）',
                nameGap:10,
                nameTextStyle:{
                    color:'#A8A8B3',
                    fontSize:12,
                    padding:[0,0,-6,-26],
                },
                axisLabel: {
                    textStyle:{
                        color:'#A8A8B3',
                        fontSize:12
                    },
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true,
                },
                splitLine:{
                    show: true,
                    lineStyle : {
                        color:'rgba(39,125,255,0.10)',
                        type:'dashed',
                    }
                },
            },
            {
                type: 'value',
                name:'（人）',
                nameGap:10,
                nameTextStyle:{
                    color:'#A8A8B3',
                    fontSize:12,
                    padding:[0,0,-6,36],
                },
                position: 'right',
                axisLabel: {
                    textStyle:{
                        color:'#A8A8B3',
                        fontSize:12
                    },
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true,
                },
                splitLine:{
                    show: true,
                    lineStyle : {
                        color:'rgba(39,125,255,0.10)',
                        type:'dashed',
                    }
                },
            }
        ],
        series: [{
            name:'人数',
            type:'bar',
            yAxisIndex: 1,
            barWidth:10,
            data : (function () {
                var arr = []
                for (var t = 0; t < data.length; t++) {
                    arr.push(data[t].value)
                }
                return arr
            })(),
            itemStyle:{
                normal:{
                    barBorderRadius:2,
                    color:'#398CFF',
                }
            },
        },{
            name:'正态分布（方差）',
            type:'line',
            showSymbol: false,
            smooth: true,
            data : (function () {
                var arr = []
                for (var t = 0; t < data.length; t++) {
                    arr.push(data[t].line)
                }
                return arr
            })(),
            itemStyle:{
                normal:{
                    color:'#FF8E2F',
                }
            },
        }],
    }
    mEcharts.setOption(optionA,true);
    chartMap[id] = mEcharts;
}