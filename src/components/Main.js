require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imagesData = require('../data/imagesData.json');


/*数组乱序排列*/
const shuffle = (a) => {
  let b = [];
  while (a.length > 0) {
    let index = parseInt(Math.random() * (a.length - 1));
    b.push(a[index]);
    a.splice(index, 1);
  }
  return b;
};

/*给定一个区间，生成这个区间内的一个随机整数，包含边界*/

const getRandomInt = (low, high) => {
  return Math.round(Math.random() * (high - low) + low)
};


//利用匿名函数，将图片名字转为图片url路径(模块化，并且该函数只执行一次)

imagesData = ((imagesData) => {
  imagesData.forEach((item) => {
    item.imageURL = require('../images/'+item.fileName);
  });

  return imagesData;

})(imagesData);

/*
单个图片组件
*/
class ImageFigure extends React.Component {

  constructor(props) {
    super(props);

    /*用箭头函数绑定this为当前组件*/
    this.handleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      if(this.props.info.isCenter){ //如果组件图片居中，则翻转
        this.props.inverse();

      }else{ //如果组件图片不居中，则将选中的图片居中，其余图片重新布局
        this.props.rearrange();
      }
    }
  }


  render() {

    let styleObj = this.props.info.pos;

    /*为每个figure的样式中的transform属性添加浏览器厂商前缀*/
    ['','Webkit','Moz','ms','O'].forEach((item) => {
      styleObj[item + 'Transform'] = 'rotateZ(' + this.props.info.rotate + 'deg)';
    });

    /*居中图片位于第二层*/
    if(this.props.info.isCenter){
      styleObj.zIndex = 11;
    }

    /*如果isInverse为true，则翻转图片*/
    if(this.props.info.isInverse){
      ['','Webkit','Moz','ms','O'].forEach((item) => {
        styleObj[item + 'Transform'] = styleObj[item + 'Transform'] + ' translateX(320px) rotateY(180deg)';
      });
    }else{

    }

    return (
      <figure className = 'img-figure' onClick = {this.handleClick} style = {styleObj}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className = 'img-title'>{this.props.data.title}</h2>
          <div className = 'img-back' >
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )

  }
}

/*
控制单元组件
*/
class ControllerUnit extends React.Component{
  constructor(props){
    super(props);

    this.handleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      if(this.props.info.isCenter){//如果对应的图片居中，则翻转
        this.props.inverse();
      }else{
        this.props.rearrange();//如果对应的图片不居中，则将对应的图片居中，其他图片重新排布
      }
    }


  }



  render(){
    let controllerUnitClassName = 'controller-unit';

    if(this.props.info.isCenter){
      controllerUnitClassName = 'controller-unit is-center';
      if(this.props.info.isInverse){
        controllerUnitClassName = 'controller-unit is-center is-inverse';
      }
    }

    return(<span className = {controllerUnitClassName} onClick = {this.handleClick} ></span>);


  }
}


/*
画廊组件
*/
class AppComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      /*用imgsInfo记录每张图片的信息*/
      imgsInfo: [
        /*{
          pos:{ //图片位置
            left: '0',
            top: '0'
          },
          rotate: 0, //旋转角
          isInverse: false, //是否翻转
          isCenter: false //是否居中
        }*/
      ]
    };

    /*初始化各个分区图片位置范围*/
    this.field = {
      leftSecX: [0, 0],
      leftSecY: [0, 0],
      rightSecX: [0, 0],
      rightSecY: [0, 0],
      topSecX: [0, 0],
      topSecY: [0, 0]
    };
    /*初始化中心图片的位置*/
    this.centerPos = {
      left: 0,
      top: 0
    };
    /*stage dom元素*/
    this.stageDOM = {};
    /*imageFigure 组件组成的数组*/
    this.imageFigures = [];

  }

  /*重新布局所有图片，内部调用
  * @param centerIndex 居中图片的index
  */
  rearrange(centerIndex){
    let imgsInfo = [];

    /*获取上分区的图片数： 0~2*/
    let topImgNum= getRandomInt(0,2);
    /*获取左分区图片数*/
    let leftImgNum = Math.round((this.imageFigures.length - 1 - topImgNum) / 2);
    /*获取右分区图片数*/
    let rightImgNum = this.imageFigures.length - 1 - topImgNum - leftImgNum;


    /*如果上分区有图，则为每张图计算一个随机的位置*/
    if(topImgNum){
      for(let i = 1; i <= topImgNum; i++ ){
        imgsInfo.push({
          pos:{
            left: getRandomInt(this.field.topSecX[0], this.field.topSecX[1]),
            top: getRandomInt(this.field.topSecY[0], this.field.topSecY[1])
          },
          rotate: Math.random() > 0.5 ? Math.round(Math.random()*30) : Math.round(Math.random()*-30),
          isInverse: false,
          isCenter: false
        })
      }
    }


    /*为左分区的每一张图计算一个随机位置*/
    for (let i = 1; i <= leftImgNum; i++){
      imgsInfo.push({
        pos:{
          left: getRandomInt(this.field.leftSecX[0], this.field.leftSecX[1]),
          top: getRandomInt(this.field.leftSecY[0], this.field.leftSecY[1])
        },
        rotate: Math.random() > 0.5 ? Math.round(Math.random()*30) : Math.round(Math.random()*-30),
        isInverse: false,
        isCenter: false
      })
    }

    /*为右分区的每一张图计算一个随机位置*/
    for (let i = 1; i <= rightImgNum; i++){
      imgsInfo.push({
        pos:{
          left: getRandomInt(this.field.rightSecX[0], this.field.rightSecX[1]),
          top: getRandomInt(this.field.rightSecY[0], this.field.rightSecY[1])
        },
        rotate: Math.random() > 0.5 ? Math.round(Math.random()*30) : Math.round(Math.random()*-30),
        isInverse: false,
        isCenter: false
      })
    }



    /*随机分布图片*/
    imgsInfo = shuffle(imgsInfo);

    /*插入居中图片的信息*/
    imgsInfo.splice(centerIndex,0,{
      pos: this.centerPos,
      rotate: 0,
      isInverse: false,
      isCenter:true
    });

    /*更新state*/
    this.setState({
      imgsInfo: imgsInfo
    })


  }


  /*图片翻转,利用闭包将index缓存下来,并将其传给子组件
  * @paras index 需要翻转图片的index
  */
  inverse(index){

    return () => {
      this.state.imgsInfo[index].isInverse = !this.state.imgsInfo[index].isInverse;
      this.setState({
        imgsInfo: this.state.imgsInfo
      });
    }
  }

  /*重新布局所有图片,利用闭包将index缓存下来,并将其传给子组件
   * @paras index 中心图片的index
   */
  rearrangeOut(centerIndex){
    return () => {
      this.rearrange(centerIndex);
    };
  }



  /*组件加载完后，为每张图片计算其位置范围*/
  componentDidMount(){

    /*获取舞台的大小*/
    let stageW = this.stageDOM.scrollWidth,
        stageH = this.stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    /*获取每个imageFigure的大小*/
    let iFW = ReactDOM.findDOMNode(this.imageFigures[0]).scrollWidth,
        iFH = ReactDOM.findDOMNode(this.imageFigures[0]).scrollHeight,
        halfIFW = Math.ceil(iFW / 2),
        halfIFH = Math.ceil(iFH / 2);
    /*计算中心图片位置*/
    this.centerPos = {
      left: halfStageW - halfIFW,
      top: halfStageH - halfIFH
    };

    /*计算各个分区图片位置范围*/
    this.field = {
      leftSecX: [-halfIFW, halfStageW - 3*halfIFW],
      leftSecY: [-halfIFH, stageH - halfIFH],
      rightSecX: [halfStageW + halfIFW, stageW - halfIFW],
      rightSecY: [-halfIFH, stageH - halfIFH],
      topSecX: [halfStageW - iFW, halfStageW],
      topSecY: [-halfIFH, halfStageH - 3*halfIFH]
    };


    this.rearrange(0);

  }





  render() {

    let controllerUnits = [],
        imageFigures = [];

    imagesData.forEach((item, index) => {

      if(!this.state.imgsInfo[index]){/*初始化每张图片的信息*/
        this.state.imgsInfo[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imageFigures.push(<ImageFigure
        key = {index}
        info = {this.state.imgsInfo[index]}
        data = {item}
        inverse = {this.inverse(index)}
        rearrange = {this.rearrangeOut(index)}
        ref = {(imageFigure) => {this.imageFigures[index] = imageFigure}}/>);

      controllerUnits.push(<ControllerUnit
        key = {index}
        info = {this.state.imgsInfo[index]}
        rearrange = {this.rearrangeOut(index)}
        inverse = {this.inverse(index)}


        />);


    });





    return (
      <section className = "stage" ref = {(stage) => { this.stageDOM = stage}}>
        <nav className = "nav-control">
          {controllerUnits}
        </nav>
        <section className = "img-sec">
          {imageFigures}
        </section>
      </section>

    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
