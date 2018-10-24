import { Component } from "./component"
import { createElement } from "./create-element";
import { Json } from "../../basic/json";

export var React = {
    Component: Component,
    createElement: createElement,
    props: function (params: { [key: string]: string | number | boolean | object }): string {
        return Json.serializ(params);
    }
}
