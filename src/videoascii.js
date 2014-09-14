var asciify = require('asciify');

function videoascii(options){
    var canvas = options.canvas;
    var ctx = canvas.getContext('2d');
    var video = options.video;
    var output_width = options.output_width;
    var font_size = (options.font_size === undefined) ? 12 : options.font_size;
    var monochrome = (options.monochrome === undefined) ? true : options.monochrome;

    var width, height, image_data, ascii_data, output_char_height,
        output_char_width, ascii_array, aspect_ratio, output_height,
        input_block_width, input_block_height, output_block_width, output_block_height,
        font_width, font_height;

    var buffer_canvas = document.createElement('canvas');
    var buffer_ctx = buffer_canvas.getContext('2d');

    // Initialization
    // Given output width, and output 'resolution', calculate block size(?)

    video.addEventListener('loadeddata', function(){
        ctx.font = font_size + "pt Courier";
        width = Math.floor(video.getBoundingClientRect().width);
        height = Math.floor(video.getBoundingClientRect().height);
        output_width = (output_width === undefined) ? width : output_width;
        aspect_ratio = width / height;
        output_height = Math.floor(output_width / aspect_ratio);
       
        canvas.width = output_width;
        canvas.height = output_height;
        buffer_canvas.width = width;
        buffer_canvas.height = height;
        image_data = buffer_ctx.getImageData(0,0,width,height);
        ascii_data = buffer_ctx.getImageData(0,0,width,height);
        output_char_height = Math.floor(output_height / font_height);
        output_char_width = Math.floor(output_width / font_width);
        window.requestAnimationFrame(update);
    });


    function update(){
        if (video.paused || video.ended){
            window.requestAnimationFrame(update);
            return;
        }
        buffer_ctx.drawImage(video,0,0);
        image_data = buffer_ctx.getImageData(0,0,width,height);
        ctx.clearRect(0, 0, output_width, output_height);
        ctx.font = font_size + "pt Courier";
        asciify(image_data, canvas, font_size, monochrome);
        window.requestAnimationFrame(update);
    }
}

module.exports = videoascii;