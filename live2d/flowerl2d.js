// 单例实例
let l2dManager = null;

//添加live2d图层
//[add_live2d_layer name="tyranol2d"]
TYRANO.kag.ftag.master_tag.add_live2d_layer = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
        name:"",
        next:"true",
        page:"fore",  // 添加默认页面层
        width:"",
        height:""
    },
    start : function(pm) {

        var that = this;
        var canvas_id = "live2d_canvas_tyrano";
		
        try {  
			// 添加异常捕获
            if(!$("#"+canvas_id)[0]){
                // 设置默认尺寸
                var width = pm.width || TYRANO.kag.config.scWidth;
                var height = pm.height || TYRANO.kag.config.scHeight;
                
                // 创建Canvas元素
                var j_canvas = $('<canvas>',{
                    id: canvas_id,
                    class: pm.name
				});
				
                //设置宽高
				j_canvas.attr("width",width);
                j_canvas.attr("height",height);
				
                // 获取正确的图层
                var target_layer = TYRANO.kag.layer.getLayer(
                    0, 
                    pm.page || "fore"  // 确保有默认值
                );
         			
                // 添加到图层
                target_layer.append(j_canvas);
				target_layer.show();
	
				//初始化l2d管理类
				l2dManager = new L2DManager();
				l2dManager.greet(); 
				l2dManager.init();
				
            }
			
        } catch(e) {
            alert("Canvas初始化失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
    }
};


//加载live2d模型
//[load_live2d_model name="huli" path="huli/huli0622.model3.json"]
TYRANO.kag.ftag.master_tag.load_live2d_model = {
    kag: TYRANO.kag,
    vital : ["name","path"],
    pm : {
		name:"",
        path:"",
		scale:"0.3", // 缩放
        x:"1000", // X坐标
		alpha:"1",  // 表示滤镜的alpha值
		rotation:"0",
		skewX:"0",
		skewY:"0"
    },
    start : async function(pm) {

        try {  
			const model = await l2dManager.loadModel(pm.name, pm.path, {
				scale: pm.scale,
				x: pm.x,
				y: pm.y,
				alpha: pm.alpha,
				rotation: pm.rotation,
				skewX: pm.skewX,
				skewY: pm.skewY		
			});
        } catch(e) {
            alert("l2d模型加载失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
		
    }
};


//添加live2d模型
//[add_live2d_model name="huli"]
TYRANO.kag.ftag.master_tag.add_live2d_model = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
		name:""
    },
    start : async function(pm) {	
		try {  	 
			l2dManager.addModel(pm.name);
		} catch(e) {
            alert("l2d模型添加失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};


//删除live2d模型
//[remove_live2d_model name="huli"]
TYRANO.kag.ftag.master_tag.remove_live2d_model = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
		name:""
    },
    start : function(pm) {	
		try {  	 
			l2dManager.removeModel(pm.name);
		} catch(e) {
            alert("l2d模型删除失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};


//设置l2d模型属性
//[mod_live2d_model name="huli"]
TYRANO.kag.ftag.master_tag.mod_live2d_model = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
		name:"undef",
		scale:"undef", // 缩放
        x:"undef", // X坐标
        y:"undef",
		alpha:"undef",  // 表示滤镜的alpha值
		rotation:"undef",
		skewX:"undef",
		skewY:"undef"
    },
    start : function(pm) {
		
		try {  
			l2dManager.modifyModelAttribute(pm.name,{
				scale: pm.scale,
				x: pm.x,
				y: pm.y,
				alpha: pm.alpha,
				rotation: pm.rotation,
				skewX: pm.skewX,
				skewY: pm.skewY		
			});
		} catch(e) {
            alert("l2d模型修改失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};


//设置l2d模型动画
//[animate_live2d_model name="huli"]
TYRANO.kag.ftag.master_tag.animate_live2d_model = {
    kag: TYRANO.kag,
    vital : ["name","property","start","target","duration"],
    pm : {
		name:"",
		property:"x",
		start: 0,
		target: 1000,
		duration: 2000
    },
    start : function(pm) {
		
		try {  
		    // 动画
            l2dManager.animateModel(pm.name, [{
                property: pm.property,
                start: pm.start,
                target: pm.target,
                duration: pm.duration,
                easing: t => Math.sin(t * Math.PI/2)
            }]);
            
		} catch(e) {
            alert("l2d模型动画失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};


//设置l2d模型部件的值，默认嘴
//[live2d_model_part name="huli" value=0.5]
TYRANO.kag.ftag.master_tag.live2d_model_part = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
		name:"",
		id: "ParamMouthOpenY",
		value: 0
    },
    start : function(pm) {	
		try {  	 
			l2dManager.setPartValue(pm.name,pm.id,pm.value);
		} catch(e) {
            alert("l2d模型部件修改失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};


//设置l2d模型的动作
//[live2d_model_motion name="Natori" group="TapBody" index="0"]
TYRANO.kag.ftag.master_tag.live2d_model_motion = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
		name:"",
		group: "Idle",
		index: "0"
    },
    start : function(pm) {	
		try {  	 
			l2dManager.setModelMotion(pm.name,pm.group,pm.index);
		} catch(e) {
            alert("l2d模型动作设置失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};

//设置l2d模型的表情
//[live2d_model_exp name="Natori" id="Angry"]
TYRANO.kag.ftag.master_tag.live2d_model_exp = {
    kag: TYRANO.kag,
    vital : ["name"],
    pm : {
		name:"",
		id: "Idle"
    },
    start : function(pm) {	
		try {  	 
			l2dManager.setModelExpression(pm.name,pm.id);
		} catch(e) {
            alert("l2d模型表情设置失败:" + e);
        } finally {  // 确保继续执行
            TYRANO.kag.ftag.nextOrder();
        }
	}
};