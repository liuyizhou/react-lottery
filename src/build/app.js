var React = require('./react');
var Data = require('./data');
var Zepto = require('./zepto');
var Touch = require('./touch');
// 导航
var Header = React.createClass({displayName: "Header",
    getInitialState : function () {
        return {
            isUpdate : false
        }
    },
    getDefaultProps : function(){
        return {
            isTouchDown         : false,    //是否按下
            currentX            : 0,        //当前位置
            left                : 0,        //偏移位置
            startX              : 0,        //按下位置
            nowX                : 0,        //移动的位置
            delateX             : 0,        //偏移的位置
            maxLeft             : 0        //最大偏移位置
        }
    },
    //触屏开始
    onTouchStart : function(e){
        var selwidth = React.findDOMNode(this.refs.selectNav);
        this.props.maxLeft = (selwidth.offsetWidth * -8) + window.innerWidth;
        if(this.props.isTouchDown){
            return ;
        }
        this.props.isTouchDown = true;
        var event=e||window.event;
        this.props.startX = event.touches[0].pageX;
    },
    //触屏滑动
    onTouchMove : function(e){
        e.preventDefault();
        if(!this.props.isTouchDown){
            return;
        }
        var event=e||window.event;
        this.props.nowX = event.touches[0].pageX;
        this.props.delateX = this.props.nowX - this.props.startX;
        this.props.left = this.props.currentX + this.props.delateX;

        this.setState({
           isUpdate : !this.state.isUpdate
        });

    },
    //触屏结束
    onTouchEnd : function(e){

        if(!this.props.isTouchDown){
            return;
        }
        this.props.isTouchDown = false;

        //判断超过最左边，最右边，如果超过则定定位到  极限位置
        if(this.props.delateX > 0 && this.props.left>0){
            this.props.left = 0;
            this.setState({
                isUpdate : !this.state.isUpdate
            });
        }else if(this.props.delateX < 0 && this.props.left<this.props.maxLeft){
            // console.log(this.props.maxLeft)
            this.props.left = this.props.maxLeft;
            this.setState({
                isUpdate : !this.state.isUpdate
            });
        }
        this.props.currentX = this.props.left;
        this.props.startX = 0;
        this.props.nowX = 0;
        this.props.delateX = 0;
    },
    componentDidMount: function(){
        $('.select-nav li').bind('click', function(event) {
            $(this).addClass('active').siblings('li').removeClass('active');
        });
    },
    render: function() {
        //事件组合
        var Events = {
            onTouchStart : this.onTouchStart,
            onTouchMove : this.onTouchMove,
            onTouchEnd : this.onTouchEnd
        }
       return (
        React.createElement("nav", React.__spread({className: "sever-nav"},  Events), 
            React.createElement("ul", {className: "select-nav", style: {transform:'translate3d( ' + this.props.left +'px , 0px , 0px)'}}, 
                React.createElement("li", {className: "active", ref: "selectNav"}, "选第1位", React.createElement("i", {className: "reward"})), 
                React.createElement("li", null, "选2全中"), 
                React.createElement("li", null, "选3全中", React.createElement("i", {className: "reward"})), 
                React.createElement("li", null, "选4全中"), 
                React.createElement("li", null, "选5全中"), 
                React.createElement("li", null, "选6中5"), 
                React.createElement("li", null, "选7中5"), 
                React.createElement("li", null, "选8中5")
            )
        )
        );
    }
});
// 底部
var Footer = React.createClass({displayName: "Footer",
    render: function() {
       return (
        React.createElement("footer", {className: "footer"}, 
            React.createElement(RewardTip, null), 
            React.createElement(Random, null), 
            React.createElement(SubmitBtn, null)
        )
        );
    }
});
// 底部奖励信息
var RewardTip = React.createClass({displayName: "RewardTip",
    render: function(){
        var message = [
            React.createElement("p", null, "至少选2个球，猜中任意2个，中13元"),
            React.createElement("p", null, "猜中任意三个开奖号码，单注奖", React.createElement("span", {className: "bonus"}, "26元"), "，再加奖", React.createElement("span", {className: "bonus"}, "4元")),
            React.createElement("p", null, "猜中任意五个开奖号码，单注奖", React.createElement("span", {className: "bonus"}, "74元"), "，再加奖", React.createElement("span", {className: "bonus"}, "6元"))
        ];
        return (
            React.createElement("div", {className: "reward-tip"}, 
                message
            )
        );
    }
});
// 底部摇一摇随机选号
var Random = React.createClass({displayName: "Random",
    handleClick: function(){
        function GetRandomNum(Min,Max)
            {   
            var Range = Max - Min;   
            var Rand = Math.random();   
            return(Min + Math.round(Rand * Range));   
            }   
            var num = GetRandomNum(1,11);
            alert("随机选择 "+num);

    },
    componentDidMount: function(){
        var SHAKE_THRESHOLD = 3000;
        var last_update = 0;
        var x = y = z = last_x = last_y = last_z = 0;
        function init() {
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', deviceMotionHandler, false);
            } else {
                alert('not support mobile event');
            }
        }
        function deviceMotionHandler(eventData) {
            var acceleration = eventData.accelerationIncludingGravity;
            var curTime = new Date().getTime();
            if ((curTime - last_update) > 100) {
                var diffTime = curTime - last_update;
                last_update = curTime;
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                if (speed > SHAKE_THRESHOLD) {
                    function GetRandomNum(Min,Max)
                    {   
                    var Range = Max - Min;   
                    var Rand = Math.random();   
                    return(Min + Math.round(Rand * Range));   
                    }   
                    var num = GetRandomNum(1,11);
                    alert("摇动了手机,选"+num); 
                }
                last_x = x;
                last_y = y;
                last_z = z;
            }
        }
    },
    render: function(){
        return (
            React.createElement("a", {href: "javascript:;"}, 
                React.createElement("img", {src: "img/random.png", className: "random", alt: "随机一注", onClick: this.handleClick})
            )
        );
    }
});
// 底部AJAX提交按钮
var SubmitBtn = React.createClass({displayName: "SubmitBtn",
    render: function(){
        return(
            React.createElement("a", {href: "javascript:;", className: "btn btn-chose"}, 
                "至少选择两个球"
            )
            );
    }
});
// 滑动（查看和收起）
var Slide = React.createClass({displayName: "Slide",
    getInitialState: function() {
        return {
            pull: false,
            img_src: 'img/icon_down.png',
            transform: 0,
            trem:50,
            remain:'00:09:37'
        };
      },
    handleDown: function(e) {
        var winHeight = window.innerHeight;
        var otherHeight = $('.footer').height() + $('nav').height() + $('.open').height();
        var moveh = winHeight - otherHeight;
        this.setState({
            pull: !this.state.pull,
            img_src: 'img/icon_up.png',
            transform: moveh
        });
      },
    handleUp: function(e) {
        this.setState({
            pull: !this.state.pull,
            img_src: 'img/icon_down.png',
            transform: 0
        });
      },
    componentDidMount: function() {
        document.getElementById('open').addEventListener('swipeDown',this.handleDown);
        document.getElementById('open').addEventListener('swipeUp',this.handleUp);
    },
    render: function(){
        var text = this.state.pull ? '上滑收起' : '下拉历史开奖';
        var img_src = this.state.img_src;
        return(
            React.createElement("div", {className: "open", id: "open", style: {transform:'translate3d( 0px , '+ this.state.transform +'px , 0px)'}}, 
                React.createElement("p", null, 
                    React.createElement("img", {src: "img/icon_clock.png", alt: "time", className: "icon icon-clock"}), 
                    "距离", this.state.trem, "期截止", 
                    React.createElement("span", {className: "remain-time"}, this.state.remain)
                ), 
                React.createElement("div", {className: "pull-reward"}, text, React.createElement("img", {src: img_src, className: "icon icon-up"}))
            )
        );
    }
});
// 开奖结果
var ResultContent = React.createClass({displayName: "ResultContent",
    render: function(){
        var resultlist = this.props.resultData.map(function(t,i) {
            return(
                React.createElement("div", {className: "lotterys", key: i}, 
                    React.createElement("span", {className: "badge"}, t.trem, "期"), 
                    React.createElement("span", {className: "lottery"}, t.number[0]), 
                    React.createElement("span", {className: "lottery"}, t.number[1]), 
                    React.createElement("span", {className: "lottery"}, t.number[2]), 
                    React.createElement("span", {className: "lottery"}, t.number[3]), 
                    React.createElement("span", {className: "lottery"}, t.number[4])
                )
                );
        });
        return (
            React.createElement("div", {className: "result result-warp"}, 
                resultlist, 
                React.createElement(Reloadstatus, null)
            )
        );      
    }
});
// 刷新提示
var Reloadstatus = React.createClass({displayName: "Reloadstatus",
    render: function(){
        return(
            React.createElement("div", {className: "reload"}, 
                React.createElement("img", {src: "img/icon_success.png", className: "reload-success"}), "刷新成功"
            )
        );
    }
});
//号码选择
var SelectItem = React.createClass({displayName: "SelectItem",
    getDefaultProps: function() {
        return {
            items: ["01","02","03","04","05","06","07","08","09","10","11"]
        };
    },
    componentDidMount: function(){
        $('.select-warp li').bind('click', function(event) {
            $(this).addClass('active').siblings('li').removeClass('active');
        });
    },
    render: function(){
        return(
            React.createElement("ul", {className: "select-warp"}, 
                
                    this.props.items.map(function(item, index) {
                        return React.createElement("li", {className: "numbers"}, item)
                    })
                
            )
        );
    }
});
// 响应内容盒子
var Content = React.createClass({displayName: "Content",
    getInitialState : function() {
        return {boxheight:0};
    },
    componentDidMount : function() {
        var nav = React.findDOMNode(this.refs.header);
        var footer = React.findDOMNode(this.refs.footer);
        var boxY = window.innerHeight - nav.offsetHeight - footer.offsetHeight;
        this.setState({boxheight : boxY});
    },
    render: function(){
        return(
            React.createElement("div", {className: "layout"}, 
                React.createElement(Header, {ref: "header"}), 
                React.createElement("article", {className: "content", style: {height:this.state.boxheight}}, 
                    React.createElement(Slide, {timeData: Data}), 
                    React.createElement("div", {id: "warp"}
                    )
                ), 
                React.createElement(Footer, {ref: "footer"})
            )
        );
    }
});
// 开启触摸
React.initializeTouchEvents(true);
// 渲染
React.render(
    React.createElement(Content, null),
    document.body
);
React.render(
    React.createElement(SelectItem, null),
    document.getElementById('warp')
);
$(".open").swipeDown( function() {
    React.render(
        React.createElement(ResultContent, {resultData: Data}),
        document.getElementById('warp')
    );
});
$(".open").swipeUp( function() {
    React.render(
        React.createElement(SelectItem, null),
        document.getElementById('warp')
    );
});