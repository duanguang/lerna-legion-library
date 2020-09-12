/**
 * legions-mobx-decorator v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
import { Modal } from 'antd';

var OpenModal = function OpenModal(options) {
  //信息提示样式
  options.type = options.type || 'success';
  var ref = Modal[options.type]({
    title: options.title || '',
    content: options.content || '',
    onOk: function onOk() {
      options.onOk && options.onOk();
      ref.destroy();
    }
  });
};
var OpenDeleteConfirm = function OpenDeleteConfirm(options) {
  var ref = Modal.confirm({
    title: options && options.title || '删除',
    content: options && options.content || '您确认删除选中数据吗？',
    okText: options && options.okText || '确认',
    okType: options && options.okType || 'danger',
    cancelText: options && options.cancelText || '取消',
    onOk: function onOk() {
      options.onOk && options.onOk();
      ref.destroy();
    },
    onCancel: function onCancel() {
      options.onCancel && options.onCancel();
      ref.destroy();
    }
  });
};
var OpenConfirm = function OpenConfirm(options) {
  var ref = Modal.confirm({
    title: options.title || 'confirm',
    content: options.content,
    okText: options.okText || '确认',
    okType: options.okType || 'danger',
    cancelText: options.cancelText || '取消',
    onOk: function onOk() {
      options.onOk && options.onOk();
      ref.destroy();
    },
    onCancel: function onCancel() {
      options.onCancel && options.onCancel();
      ref.destroy();
    }
  });
};

export { OpenConfirm, OpenDeleteConfirm, OpenModal };
