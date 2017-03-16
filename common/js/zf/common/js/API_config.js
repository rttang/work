/**
 * @fileOverview 页面提供数据的API_config
 * @description 涉及到业务中取数据的所有接口相关的参数配置，param 为API_URL请求时必填参数，callBack
 * 为ajax的回调函数<br/>
 * @author 905112
 * @version 1.0
 */

/**
 * @description    根据站点，获取根栏目信息
 * @see  {string} columnCode 栏目编码，在iepgm中是栏目名称
 * @see  {string} siteId 为iepgm的站点ID
 * @see  {function} callBack ajax返回函数getRootColumn
 */

var VOD_getRootContent = {
	"param" : {
		"columnCode" : columnCode,
		"siteId" : siteId
	},
	"callBack" : getRootColumn
};

/**
 * @description    获取栏目的所有子栏目
 * @see {string} columnId 栏目ID
 * @see {number} limit每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getChildColumn
 */

var VOD_getChildColumnList = {
	"param" : {
		"columnId" : columnId,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getChildColumn
};

/**
 * @description    获取栏目底下所挂的媒资列表信息
 * @see {string} columnId 栏目ID
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getAsset
 */

var VOD_getAssetList = {
	"param" : {
		"columnId" : columnId,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getAsset
};

/**
 * @description    获取栏目下推荐媒资
 * @see {string} columnId 栏目ID
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getRecomdedAsset
 */

var VOD_getRecommendedAssetList = {
	"param" : {
		"columnId" : columnId,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getRecomdedAsset
};

/**
 * @description    获取影片详情信息
 * @see {string} columnMapId 媒资上架ID
 * @see {string} checkBuy 检查购买信息（Y：返回购买信息，N：不返回购买信息（默认））
 * @see {string} checkBookmark 检查书签信息（Y：返回书签信息，N：不返回书签（默认））
 * @see {function} callBack ajax返回函数getAssetDetail
 */

var VOD_getAssetDetail = {
	"param" : {
		"columnMapId" : columnMapId,
		"checkBuy" : buyFlag,
		"checkBookmark" : bookmarkFlag
	},
	"callBack" : getAssetDetail
};

/**
 * @description    获取点播排行信息（单片、电视剧、新闻等）
 * @see {string} recordType 获取相关类型的点播排行（为空时不区分影片类型，pakg：资源包，movie：电影，news：新闻）
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getPlayTop
 */

var VOD_getPlayTop = {
	"param" : {
		"recordType" : recordType,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getPlayTop
};

/**
 * @description    获取媒资关联信息，可能是根据导演、主演、产地、类型等进行自动关联(也可以在iepgm那影片管理中添加影片关联信息)
 * @see {string} columnMapId 媒资上架ID
 * @see {string} associationType 影片关联方式（keyword：关键字（默认），title：影片名称，type：媒资类别，actor：影片主演，director：媒资导演）
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getAssociatedAsset
 */

var VOD_getAssociatedAsset = {
	"param" : {
		"columnMapId" : columnMapId,
		"associationType" : associationType,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getAssociatedAsset
};

/**
 * @description    获取电视剧/系列剧的集数信息
 * @see {string} columnMapId 媒资上架ID
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getSubAsset
 */

var VOD_getSubAssetList = {
	"param" : {
		"columnMapId" : columnMapId,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getSubAsset
};

/**
 * @description    获取资源包子资源详情信息
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 子资源ID
 * @see {string} checkBuy 检查购买信息（Y：返回购买信息，N：不返回购买信息（默认））
 * @see {string} checkBookmark 检查书签信息（Y：返回书签信息，N：不返回书签（默认））
 * @see {function} callBack ajax返回函数getSubAssetDetail
 */

var VOD_getSubAssetDetail = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId,
		"checkBuy" : buyFlag,
		"checkBookmark" : bookmarkFlag
	},
	"callBack" : getSubAssetDetail
};

/**
 * @description  播放时查询资源包下一个子资源
 * @see {string} columnMapId 媒资上架ID
 * @see {string} chapters 媒资的当前集数（也是资源包总集数，默认是1）
 * @see {function} callBack ajax返回函数getNextSubAsset
 * @see {string} checkBuy 检测下一集资源是否购买，目前连续剧只支持整包购买，此参数传"N"即可，此参数（请求数据时可选）
 * @see {string} checkBookmark 检测下一集资源是否有书签。默认不检查，传"N"。，此参数（请求数据时可选）
 */

var VOD_getNextSubAsset = {
    "param" : {
        "columnMapId" : columnMapId,
        "chapter" : chapters,
        "checkBuy" : "N",
        "checkBookmark" : "N"
    },
    "callBack" : getNextSubAsset
};

/**
 * @description    根据关键字搜索相关媒资资源
 * @see {string} keyword 媒资上架ID
 * @see {string} siteId 站点别名（columnId如果为空则siteId为必选，不支持跨站点搜索）
 * @see {string} columnId 栏目ID（当前栏目以及子栏目下进行搜索）
 * @see {string} filterType
 * 搜索时过滤类型（keyword：关键字（默认），title：影片名称，type：媒资分类，actor：影片主演，director：媒资导演，origin：
 * 产地）
 * @see {string} recordType 搜索的媒资类型(为空时不区分影片类型，pakg：资源包，film：电影，news：新闻）
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数searchAsset
 */

var VOD_getAssetListByKeyword = {
	"param" : {
		"keyword" : keyword,
		"siteId" : siteId,
		"columnId" : columnId,
		"filterType" : filterType,
		"recordType" : recordType,
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : searchAsset
};

/**
 * @description    用户对选择的资源进行评级
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 资源ID
 * @see {string} grade 资源级别
 * @see {function} callBack ajax返回函数doRatingData
 */

var VOD_resourceRating = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId,
		"grade" : grade
	},
	"callBack" : doRatingData
};

/**
 * @description    查看资源的用户评级
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 资源ID
 * @see {function} callBack ajax返回函数getRatingData
 */

var VOD_getResourceRating = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId
	},
	"callBack" : getRatingData
};

/**
 * @description    对资源进行推荐或好评
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 资源ID
 * @see {function} callBack ajax返回函数getRecommendAsset
 */

var VOD_recommendAsset = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId
	},
	"callBack" : getRecommendAsset
};

/**
 * @description    根据前台提供的参数组成RTSP播放串
 * @see {string} columnMapId 媒资上架ID
 * @see {string} tryFlag 播放类型（1：表示试用，0：正常使用（默认））
 * @see {string} resourceId 资源ID(电视剧子集进行的点播时候，该字段为必填)
 * @see {string} rtspType rtsp格式（N：NGOD格式，O：OC1.0格式（默认））
 * @see {function} callBack ajax返回函数getVodRtsp
 */

var VOD_getVodPlayRtsp = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId,
		"rtspType" : rtspType,
		"tryFlag" : tryFlag
	},
	"callBack" : getVodRtsp
};

/**
 * @description    新闻拆条页面获取rtsp串
 * @see {string} columnMapIds 多个新闻节目的上架ID，以'_'线分割。
 * @see {string} rtspType rtsp格式（N：NGOD格式，O：OC1.0格式（默认））
 * @see {function} callBack ajax返回函数getNewsRtspList
 */

var VOD_getNewsPlayRtspList = {
	"param" : {
		"columnMapIds" : columnMapIds,
		"rtspType" : rtspType
	},
	"callBack" : getNewsRtspList
};

/**
 * @description    从断点信息开始播放
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 资源ID(电视剧或系列剧resourceId为子资源ID)
 * @see {string} timePosition 断点信息
 * @see {function} callBack ajax返回函数getBookmarkPlay
 */

var VOD_bookmarkPlay = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId,
		"timePosition" : timePosition
	},
	"callBack" : getBookmarkPlay
};

/**
 * @description    收藏影片资源
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getFavoritesBack
 */

var VOD_getVodFavorites = {
	"param" : {
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getFavoritesBack
};

/**
 * @description    将影片资源添加到收藏
 * @see {string} columnMapId 媒资上架ID
 * @see {string} url 转跳地址（一般是详情页的url）
 * @see {string} resourceId 资源ID（支持资源包）
 * @see {function} callBack ajax返回函数saveFavoritesBack
 */

var VOD_saveVodFavorites = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId,
		"url" : url
	},
	"callBack" : saveFavoritesBack
};

/**
 * @description    根据前台提供的参数组成RTSP播放串
 * @see {string} favoritesId 所要删除收藏中的的资源ID
 * @see {function} callBack ajax返回函数removeFavoritesBack
 */

var VOD_removeVodFavorites = {
	"param" : {
		"favoritesId" : favoritesId
	},
	"callBack" : removeFavoritesBack
};

/**
 * @description    根据用户ID查询用户在某段时间内的VOD使用记录
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getAsset
 */

var VOD_getVodRecordList = {
	"param" : {
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getRecord
};

/**
 * @description    VOD点播中途退出时，可以对此记录书签保存。
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 资源ID(电视剧子集进行的点播时候，该字段为必填)
 * @see {string} timePosition 用户退出时正在看的影片时间点,下次可以直接从这个时间接着看
 * @see {string} token 如果NGOD规范，token是必填项(此字段暂时不使用)
 * @see {function} callBack ajax返回函数saveBookmarkBack
 */

var VOD_saveBookmark = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId,
		"timePosition" : timePosition
		//"token" : token
	},
	"callBack" : saveBookmarkBack
};

/**
 * @description    查询VOD书签列表
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getAsset
 */

var VOD_getBookmarkList = {
	"param" : {
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getBookmark
};

/**
 * @description    判断用户是否存在指定媒资的书签
 * @see {string} columnMapId 媒资上架ID
 * @see {string} resourceId 资源ID(电视剧子集进行的点播时候，该字段为必填)
 * @see {function} callBack ajax返回函数getAsset
 */

var VOD_checkBookmark = {
	"param" : {
		"columnMapId" : columnMapId,
		"resourceId" : resourceId
	},
	"callBack" : checkBookmark
};

/**
 * @description    删除VOD书签
 * @see {string} bookmarkId 书签ID
 * @see {function} callBack ajax返回函数deleteBookmarkBack
 */

var VOD_deleteBookmark = {
	"param" : {
		"bookmarkId" : bookmarkId
	},
	"callBack" : deleteBookmarkBack
};

/**
 * @description    根据用户ID以及产品ID进行用户订购关系的鉴权
 * @see {string} buyMode 购买方式（1:栏目类或包月类商品,2：电影或资源包整部购买,3：资源包分集购买）
 * @see {string} goodsId 商品ID（当buyMode等于1 时该字段为必填）
 * @see {string} columnMapId 媒资上架ID（当buyMode不等于1时该字段为必填）
 * @see {string} resourceId 资源ID（当buyMode等于3时该字段为必填）
 * @see {function} callBack ajax返回函数checkBuyBack
 */

var VOD_checkBuy = {
	"param" : {
		"buyMode" : buyMode,
		"goodsId" : goodsId,
		"columnMapId" : columnMapId,
		"resourceId" : resourceId
	},
	"callBack" : checkBuyBack
};

/**
 * @description    在线订购提示
 * @see {string} buyMode 购买方式（1:栏目类或包月类商品,2：电影或资源包整部购买,3：资源包分集购买）
 * @see {string} goodsId 商品ID（当buyMode等于1 时该字段为必填）
 * @see {string} columnMapId 媒资上架ID（当buyMode不等于1时该字段为必填）
 * @see {string} resourceId 资源ID（当buyMode等于3时该字段为必填）
 * @see {function} callBack ajax返回函数buyTipBack
 */

var VOD_buyTips = {
	"param" : {
		"buyMode" : buyMode,
		"goodsId" : goodsId,
		"columnMapId" : columnMapId,
		"resourceId" : resourceId
	},
	"callBack" : buyTipBack
};

/**
 * @description    用户在线订购商品
 * @see {string} buyMode 购买方式（1:栏目类或包月类商品,2：电影或资源包整部购买,3：资源包分集购买）
 * @see {string} goodsId 商品ID（当buyMode等于1 时该字段为必填）
 * @see {string} columnMapId 媒资上架ID（当buyMode不等于1时该字段为必填）
 * @see {string} resourceId 资源ID（当buyMode等于3时该字段为必填）
 * @see {function} callBack ajax返回函数buyBack
 */

var VOD_buy = {
	"param" : {
		"buyMode" : buyMode,
		"goodsId" : goodsId,
		"columnMapId" : columnMapId,
		"resourceId" : resourceId
	},
	"callBack" : buyBack
};

/**
 * @description    获取用户帐户信息(积分,信用额度)
 * @see {string} param 不需要传参数进入时，param值为空。
 * @see {function} callBack ajax返回函数getUserAccount
 */

var VOD_getUserAccount = {
	"param" : "",
	"callBack" : getUserAccount
};

/**
 * @description    提供获取积分规格
 * @see {string} columnMapId 媒资上架ID
 * @see {string} ruleCode 积分规则代码（如果该字段为空，则返回所有积分规则）
 * @see {function} callBack ajax返回函数getIntegralRule
 */

var VOD_getIntegralRule = {
	"param" : {
		"ruleCode" : ruleCode
	},
	"callBack" : getIntegralRule
};

/**
 * @description    用户兑换积分
 * @see {string} integralAmmonut 需要兑换积分量
 * @see {function} callBack ajax返回函数getExchangeIntegral
 */

var VOD_exchangeIntegral = {
	"param" : {
		"integralAmmonut" : integralAmmonut
	},
	"callBack" : getExchangeIntegral
};

/**
 * @description    获取频道列表信息
 * @see {string} type 类型（btv：频道回看）
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getBTVChannel
 */

var BTV_getChannelList = {
	"param" : {
		"type" : "btv",
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getBTVChannel
};

/**
 * @description    根据服务类型获取指定频道的节目单信息
 * @see {string} channelId 频道ID
 * @see {string} dateFlag 日期标志（8代表今天（默认），7代表昨天，依次类推）
 * @see {string} type 类型(btv：频道回看)
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getBTVProgram
 */

var BTV_getProgramList = {
	"param" : {
		"channelId" : channelId,
		"dateFlag" : dateFlag,
		"type" : "btv",
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getBTVProgram
};

/**
 * @description    获取相关联栏目列表
 * @see {string} programId 关联的节目单ID
 * @see {string} type 类型(btv：频道回看)
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getBTVAssociated
 */

var BTV_getAssociatedProgram = {
	"param" : {
		"programId" : programId,
		"type" : "btv",
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getBTVAssociated
};

/**
 * @description    收藏电视节目
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getBTVFavorites
 */

var BTV_getTvFavorites = {
	"param" : {
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getBTVFavorites
};

/**
 * @description    将节目资源添加到收藏
 * @see {string} channelId 频道对应的频道id
 * @see {string} programId 节目id
 * @see {function} callBack ajax返回函数saveBTVFavorites
 */

var BTV_saveTvFavorites = {
	"param" : {
		"channelId" : channelId,
		"programId" : programId
	},
	"callBack" : saveBTVFavorites
};

/**
 * @description   将节目资源从收藏中删除
 * @see {string} favoritesId 所要删除收藏中的的资源id
 * @see {function} callBack ajax返回函数removeBTVFavorites
 */

var BTV_removeTvFavorites = {
	"param" : {
		"favoritesId" : favoritesId
	},
	"callBack" : removeBTVFavorites
};

/**
 * @description    根据用户ID查询用户在某段时间内的BTV使用记录
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数getBTVRecord
 */

var BTV_getBtvRecordList = {
	"param" : {
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : getBTVRecord
};

/**
 * @description    根据前台提供的参数组成RTSP播放串
 * @see {string} channelId 媒资上架ID
 * @see {string} tryFlag 播放类型（1：表示试用，0：正常使用（默认））
 * @see {string} type 播放类型(btv用来统计播放会话数据供报表使用)
 * @see {string} programId 节目单ID(通过节目单Id可以得到频道ID，还要判断频道是否与商品对应)
 * @see {string} rtspType rtsp格式（N：NGOD格式，O：OC1.0格式（默认））
 * @see {function} callBack ajax返回函数getBTVRtsp
 */

var BTV_getTvPlayRtsp = {
	"param" : {
		"channelId" : channelId,
		"tryFlag" : tryFlag,
		"type" : "btv",
		"programId" : programId,
		"rtspType" : rtspType
	},
	"callBack" : getBTVRtsp
};

/**
 * @description    根据关键字搜索节目单信息
 * @see {string} keyword 节目关键字
 * @see {string} channelId 频道资源Id（如果资源ID为空，搜索所有节目）
 * @see {string} type type 播放类型(btv：电视回看）
 * @see {number} limit 每页显示条数，默认为8，limit=0不分页
 * @see {number} page 要显示的页码，默认为1
 * @see {function} callBack ajax返回函数searchBTVProgram
 */

var BTV_getProgramListByKeyword = {
	"param" : {
		"keyword" : keyword,
		"channelId" : channelId,
		"type" : "btv",
		"limit" : pageSize,
		"page" : curPage
	},
	"callBack" : searchBTVProgram
};

/**
 * @description    查询频道列表
 * @see {number} limit 每页显示条数，默认为8（当limit等于零或等于空时返回默认大小8，当请求全部数据时，可以不传）
 * @see {number} page 要显示的页码，默认为1（当页面请求全部数据时，可以不传）
 * @see {string} allData 全部数据标识（allData等于1时，表示后台不分页，返回全部数据。当不传或为空时，后台进行分页处理。）
 * @see {function} callBack ajax返回函数getNPVRChannel
 */

var NPVR_queryChannel = {
	"param" : {
		"limit" : pageSize,
		"page" : curPage,
		"allData" : ""
	},
	"callBack" : getNPVRChannel
};

/**
 * @description    获取支持回看的频道节目内容列表，返回从当天开始后面7天的节目单数据
 * @see {string} resourceId 资源ID
 * @see {number} limit 每页显示条数，默认为8（当limit等于零或等于空时返回默认大小8，当请求全部数据时，可以不传）
 * @see {number} page 要显示的页码，默认为1（当页面请求全部数据时，可以不传）
 * @see {string} allData 全部数据标识（allData等于1时，表示后台不分页，返回全部数据。当不传或为空时，后台进行分页处理。）
 * @see {function} callBack ajax返回函数getNPVRProgram
 */

var NPVR_queryProgramGuide = {
	"param" : {
		"resourceId" : resourceId,
		"limit" : pageSize,
		"page" : curPage,
		"allData" : ""
	},
	"callBack" : getNPVRProgram
};

/**
 * @description    获取录像清单的节目单
 * @see {string} paramName 排序参数（channelName：频道名称）
 * @see {number} limit 每页显示条数，默认为8（当limit等于零或等于空时返回默认大小8，当请求全部数据时，可以不传）
 * @see {number} page 要显示的页码，默认为1（当页面请求全部数据时，可以不传）
 * @see {string} allData 全部数据标识（allData等于1时，表示后台不分页，返回全部数据。当不传或为空时，后台进行分页处理。）
 * @see {function} callBack ajax返回函数getNPVRRecordList
 */

var NPVR_queryRecordByUserId = {
	"param" : {
		"paramName" : paramName,
		"limit" : pageSize,
		"page" : curPage,
		"allData" : ""
	},
	"callBack" : getNPVRRecordList
};

/**
 * @description    查看节目单关联的节目
 * @see {string} programName 节目名称
 * @see {number} limit 每页显示条数，默认为8（当limit等于零或等于空时返回默认大小8，当请求全部数据时，可以不传）
 * @see {number} page 要显示的页码，默认为1（当页面请求全部数据时，可以不传）
 * @see {string} allData 全部数据标识（allData等于1时，表示后台不分页，返回全部数据。当不传或为空时，后台进行分页处理。）
 * @see {function} callBack ajax返回函数getNPVRRelated
 */

var NPVR_programRelated = {
	"param" : {
		"programName" : programName,
		"limit" : pageSize,
		"page" : curPage,
		"allData" : ""
	},
	"callBack" : getNPVRRelated
};

/**
 * @description    根据关键字搜索节目单
 * @see {string} searchkey 搜索关键字
 * @see {number} limit 每页显示条数，默认为8（当limit等于零或等于空时返回默认大小8，当请求全部数据时，可以不传）
 * @see {number} page 要显示的页码，默认为1（当页面请求全部数据时，可以不传）
 * @see {string} allData 全部数据标识（allData等于1时，表示后台不分页，返回全部数据。当不传或为空时，后台进行分页处理。）
 * @see {function} callBack ajax返回函数searchNPVRProgram
 */

var NPVR_programSearch = {
	"param" : {
		"searchkey" : searchkey,
		"limit" : pageSize,
		"page" : curPage,
		"allData" : ""
	},
	"callBack" : searchNPVRProgram
};

/**
 * @description    AAA资源鉴权
 * @see {string} resourceId 频道对应的资源ID
 * @see {function} callBack ajax返回函数getNPVRAuth
 */

var NPVR_authProdOfferingByReId = {
	"param" : {
		"resourceId" : resourceId
	},
	"callBack" : getNPVRAuth
};

/**
 * @description    点播录制完成的节目单
 * @see {string} pvrId 录制单Id
 * @see {function} callBack ajax返回函数getNPVRRtsp
 */

var NPVR_getPlayRtsp = {
	"param" : {
		"pvrId" : pvrId
	},
	"callBack" : getNPVRRtsp
};

/**
 * @description    删除录像清单，可删除录制失败、待录制和录制成功节目单（录制中的节目不能删除）
 * @see {string} pvrId 录像清单Id
 * @see {function} callBack ajax返回函数deleteNPVRRecord
 */

var NPVR_deleteRecord = {
	"param" : {
		"pvrId" : pvrId
	},
	"callBack" : deleteNPVRRecord
};

/**
 * @description    查看节目时长（总时长，剩余时长，已录时长）
 * @see {string} prodofferingId 频道对应产品ID
 * @see {function} callBack ajax返回函数getNPVRLeavingsTime
 */

var NPVR_findUserLeavingsTime = {
	"param" : {
		"prodofferingId" : prodofferingId
	},
	"callBack" : getNPVRLeavingsTime
};

/**
 * @description    录制节目
 * @see {string} columnMapId 频道对应资源ID
 * @see {string} prodOfferingId 频道所属产品ID
 * @see {string} programGuideId
 * @see {function} callBack ajax返回函数saveNPVRRecord
 */

var NPVR_saveRecord = {
	"param" : {
		"resourceId" : resourceId,
		"prodOfferingId" : prodOfferingId,
		"programGuideId" : programGuideId
	},
	"callBack" : saveNPVRRecord
};
