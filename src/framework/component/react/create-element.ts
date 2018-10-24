export function createElement( tag, attrs, ...children ) {

    // 数组转换为内容节点
    let regroup = [];

    children.forEach((v,i)=>{
        if(typeof v === 'object' && undefined !== v.length){
            v.forEach((v_2)=>{
                regroup.push(v_2);
            });
        }else{
            regroup.push(v);
        }
    });

    attrs = attrs || {};

    return {
        tag,
        attrs,
        children:regroup,
        key: attrs.key || null
    }
}
