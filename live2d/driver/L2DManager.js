class L2DManager {

    static instance = null;
	//存储l2d的map
    models = new Map();
	//l2d模型所在路径
	resourcesPath = 'data/others/plugin/live2d/model/';
	
    //单例模式
    constructor() {
        if (!L2DManager.instance) {
            this.app = null;
			this.Live2DModel = null;
            L2DManager.instance = this;
        }
        return L2DManager.instance;
    }

	//测试
	greet() {
		console.log('Hello, l2dtest!');
    }
	
	
    // 初始化PIXI应用，在添加图层时调用。
		init(canvasId = "live2d_canvas_tyrano") {
		
        if (!this.app) {
            this.app = new PIXI.Application({
                view: document.getElementById(canvasId),
                autoStart: true,
                transparent: true,
				width:2560,
				height:1440 //注意修改宽高
            });
        }
		
		if(!this.Live2DModel){	
			this.Live2DModel = PIXI.live2d.Live2DModel;
		}
    }
	
	
    // 加载模型,耗时操作。
    async loadModel(name, modelPath, options = {}) {
		//加载模型，关闭鼠标追踪。
        const model = await this.Live2DModel.from((this.resourcesPath + modelPath),{ autoInteract : false });
      
        const config = {
            scale:options.scale || 0.2, // 缩放
            x: options.x || 1000, // X坐标
            y: options.y || window.innerHeight * 0.1, // y坐标
			alpha: options.alpha || 1,  // 表示滤镜的alpha值
			rotation: options.rotation || 0,//旋转
			skewX: options.skewX || 0,//x倾斜
			skewY: options.skewY || 0//y倾斜
        };
		
		//不必要时不初始化滤镜，节约性能
		if(config.alpha === 0){
			model.alpha = 0;
		}else if(config.alpha === 1){
			model.alpha = 1;
		}else{
			//透明度滤镜，用来设置模型透明度
			const alphaFilter  = new PIXI.filters.AlphaFilter(config.alpha);
			model.filters = [alphaFilter];
		}
		
        // 模型缩放
        model.scale.set(config.scale);
		
        // 模型位置
		model.x = config.x;
		model.y = config.y;
		
		//旋转
		model.rotation = config.rotation;
		//x倾斜
		model.skew.x = config.skewX;
		//y倾斜
		model.skew.y = config.skewY;
		
		//添加模型到列表
        this.models.set(name, model);

        return model;
    }
	
  
	 // 添加模型到画布
    async addModel(name) {
        const model = this.models.get(name);
        if (!model) return;
		//注意,如果加载的时候设置可见性为false。此时调用addModel，不显示。
		this.app.stage.addChild(model);
	}
	


    // 修改模型属性
    modifyModelAttribute(name, options = {}) {
        const model = this.models.get(name);
        if (!model) return;
		
		const config = {
            scale:options.scale || "undef", // 缩放
            x: options.x || "undef", // X坐标
            y: options.y || "undef", // y坐标
			alpha: options.alpha || "undef",  // 表示滤镜的alpha值
			rotation: options.rotation || "undef",//旋转
			skewX: options.skewX || "undef",//x倾斜
			skewY: options.skewY || "undef"//y倾斜
        };
		
		if (config.alpha !== "undef"){
    		if (config.alpha === 0){
    			model.alpha = 0;
    		}else if(config.alpha === 1){
    			model.alpha = 1;
    		}else{
    		    model.filters = null;
    			//透明度滤镜，用来设置模型透明度
    			const alphaFilter  = new PIXI.filters.AlphaFilter(config.alpha);
    			model.filters = [alphaFilter];
    		}
		}
		
	    if(config.scale !== "undef"){
            // 模型缩放
            model.scale.set(config.scale);
		}
		
		if(config.x !== "undef"){
            // 模型位置
		    model.x = config.x;
		}
		
		if(config.y !== "undef"){
		    model.y = config.y;
		}
		
		if(config.rotation !== "undef"){
		    //旋转
		    model.rotation = config.rotation;
		}
		
		if(config.skewX !== "undef"){
		    //x倾斜
		    model.skew.x = config.skewX;
		}
		
		if(config.skewY !== "undef"){
		    //y倾斜
		    model.skew.y = config.skewY;
        }
    }




    //动画效果，现行带透明度变换
    animateModel(name, animations) {
        const model = this.models.get(name);
        if (!model) return;
    
        const ticker = PIXI.Ticker.shared;
        
        animations.forEach(anim => {
            const prop = anim.property;
            const isAlpha = prop === "alpha";
            let target, startVal, alphaFilter;
    
            // 处理透明度动画（特殊逻辑）
            if (isAlpha) {
            
                // 查找或创建滤镜（避免重复创建）
                if (model.filters) {
                    alphaFilter = model.filters.find(f => f instanceof PIXI.filters.AlphaFilter);
                } else {
                    alphaFilter = null;
                }
                
                if (!alphaFilter) {
                    alphaFilter = new PIXI.filters.AlphaFilter();
                    
                    if (!model.filters) {
                        model.filters = [];
                    }
                    
                    model.filters.push(alphaFilter);
                    model.alpha = 1; // 确保基础透明度为1，避免叠加计算
                }
                
                startVal = parseFloat(anim.start);
                target = parseFloat(anim.target);
                alphaFilter.alpha = startVal; // 初始化滤镜透明度
            } 
            // 处理其他常规属性
            else {
                const propPath = prop.split('.');
                target = parseFloat(anim.target);
                startVal = parseFloat(anim.start);
            }
    
            const duration = anim.duration ? parseInt(anim.duration) : 1000;
            const easing = anim.easing || (t => t);
            const startTime = Date.now();
    
            const update = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);
    
                // 更新透明度滤镜
                if (isAlpha) {
                    alphaFilter.alpha = startVal + (target - startVal) * easedProgress;
                } 
                // 更新常规属性
                else {
                    const currentValue = startVal + (target - startVal) * easedProgress;
                    let obj = model;
                    const propPath = prop.split('.');
                    for (let i = 0; i < propPath.length - 1; i++) {
                        obj = obj[propPath[i]];
                        if (!obj) return;
                    }
                    obj[propPath[propPath.length - 1]] = currentValue;
                }
    
                // 动画结束时清理资源
                if (progress >= 1) {
                    ticker.remove(update);
                    if (isAlpha && alphaFilter.alpha === 1) { // 完全不透明时移除滤镜
                        model.alpha = 1;
                        model.filters = model.filters.filter(f => f !== alphaFilter);
                        if (model.filters.length === 0) model.filters = null;
                    }
                    
                    if (isAlpha && alphaFilter.alpha === 0) { // 完全透明时移除滤镜
                        model.alpha = 0;
                        model.filters = model.filters.filter(f => f !== alphaFilter);
                        if (model.filters.length === 0) model.filters = null;
                    }
                    
                }
            };
    
            ticker.add(update);
        });
    }
    
    
   

    //动画效果，老
    animateMode_oldl(name, animations) {
        const model = this.models.get(name);
        if (!model) return;
    
        const ticker = PIXI.Ticker.shared;
        
        animations.forEach(anim => {
            const propPath = anim.property.split('.'); // 分割属性路径
            const target = parseFloat(anim.target); // 转换为浮点数
            const duration = anim.duration ? parseInt(anim.duration) : 1000;
            const easing = anim.easing || (t => t);
            
            const startVal = parseFloat(anim.start); // 转换为浮点数
            const startTime = Date.now();
            
            const update = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);
                
                const currentValue = startVal + (target - startVal) * easedProgress;
                
                // 设置嵌套属性
                let obj = model;
                for (let i = 0; i < propPath.length - 1; i++) {
                    obj = obj[propPath[i]];
                    if (!obj) {
                        console.error(`无效的属性路径：'${anim.property}'`);
                        ticker.remove(update);
                        return;
                    }
                }
                const lastProp = propPath[propPath.length - 1];
                obj[lastProp] = currentValue;
                
                if (progress >= 1) {
                    ticker.remove(update);
                }
            };
            
            ticker.add(update);
        });
    }


    // 可以用来设置嘴巴张开值
    setPartValue(name,id,value) {
        const model = this.models.get(name);
        if (model) {
            model.internalModel.coreModel.setParameterValueById(id,parseFloat(value));
        }
    }

    // 启用拖拽
	enableDrag(model) {
		  model.buttonMode = true;
		  model.on("pointerdown", (e) => {
			model.dragging = true;
			model._pointerX = e.data.global.x - model.x;
			model._pointerY = e.data.global.y - model.y;
		  });
		  model.on("pointermove", (e) => {
			if (model.dragging) {
			  model.position.x = e.data.global.x - model._pointerX;
			  model.position.y = e.data.global.y - model._pointerY;
			}
		  });
		  model.on("pointerupoutside", () => (model.dragging = false));
		  model.on("pointerup", () => (model.dragging = false));
		}

    // 移除模型
    removeModel(name) {
        const model = this.models.get(name);
        if (model) {
            this.app.stage.removeChild(model);
            model.destroy();
            this.models.delete(name);
        }
    }
    
	//设置模型动作
    setModelMotion(name,group,index){
		const model = this.models.get(name);
        if (model) {
            model.motion(group,parseInt(index));
        }
	}
    
	//设置模型表情
    setModelExpression(name,id){
		const model = this.models.get(name);
        if (model) {
            model.expression(id);
        }
    }
	
}
