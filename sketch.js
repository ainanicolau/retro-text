let canvas;
let canvas_height = window.innerHeight - 100 - 63;
let canvas_width = Math.round(canvas_height / 1.41);

const UPLOAD_DOWNSCALE = 2;

const DIMENSIONS = {
    'a1': [7016, 9933],
    'a2': [4690, 7016],
    'a3': [3508, 4690],
    'a4': [2480, 3508],
    'a5': [1748, 2480],
}

let background_color = [247, 247, 247];
let text_color = [236, 223, 197];
let single_custom_color = [0, 0, 0];
let COLOR_PALETTES = {"Single Custom Color": [single_custom_color],
                      "Fire": [[235, 164, 60], [235, 141, 29], [222, 83, 36], [227, 62, 52]],
                      "Contemporary": [[214, 169, 157],[216, 137, 112],[194, 156, 57],[138, 136, 101],[192, 205, 197],[65, 111, 120]],
                      "Alternative": [[233, 93, 91],[74, 137, 118],[116, 213, 229],[154, 135, 227],[238, 181, 65],[242, 134, 175],[80, 111, 175]],
                      "Pastel": [[212, 227, 220],[206, 225, 229],[252, 200, 158],[250, 231, 214],[243, 196,192]],
                      "Rainbow": [[207, 42, 34],[246, 175, 34],[114, 162, 134],[106, 170, 204],[44, 46, 67]],
                      "Lolipop": [[239, 132, 152],[172, 232, 223],[104, 218, 217],[236, 0, 77]]}
let rays_palette = "Fire"
let input_text = "FREE";
let text_size = 0.2;
let position_x = 0.2;
let position_y = 0.4;
let add_shadow = true;
let add_contour = false;

let FONT_LIST = ["AvenirNextCondensed-Heavy", "AvenirNext-Bold", "Ayuthaya", "Arial Rounded MT Bold",
                 "Baskerville-Bold","Courier-Bold", "Impact", "Krungthep"];
let font_name = FONT_LIST[0];

function setup()
{
    // TEXT PARAMETERS
    text_box = createDiv();
    text_box.parent("parameters-container");
    text_box.addClass("box");
    text_box_title = createElement('h1', 'TEXT PARAMETERS');
    text_box_title.parent(text_box);

    let text_label = createP('Text');
    text_label.parent(text_box);
    text_input = createElement('textarea', input_text);
    text_input.input(on_text_changed);
    text_input.parent(text_box);

    let text_size_label = createP('Size');
    text_size_label.parent(text_box);
    text_size_slider = createSlider(1, 30, text_size * 100);
    text_size_slider.input(on_text_size_changed);
    text_size_slider.parent(text_box);

    position_label_group = createDiv();
    position_label_group.parent(text_box);
    position_label_group.addClass("group");

    position_slider_group = createDiv();
    position_slider_group.parent(text_box);
    position_slider_group.addClass("group");

    let position_x_label = createP('Position X');
    position_x_label.parent(position_label_group);
    position_x_slider = createSlider(0, 100, position_x * 100);
    position_x_slider.input(on_position_x_changed);
    position_x_slider.parent(position_slider_group);

    let position_y_label = createP('Position Y');
    position_y_label.parent(position_label_group);
    position_y_slider = createSlider(0, 100, position_y * 100);
    position_y_slider.input(on_position_y_changed);
    position_y_slider.parent(position_slider_group);

    // STYLE
    style_box = createDiv();
    style_box.parent("parameters-container");
    style_box.addClass("box");
    style_box_title = createElement('h1', 'STYLE');
    style_box_title.parent(style_box);

    checkbox_group = createDiv();
    checkbox_group.parent(style_box);
    checkbox_group.addClass("group");

    let shadow_label = createP('Shadow');
    shadow_label.parent(checkbox_group);
    shadow_checkbox = createCheckbox('', add_shadow);
    shadow_checkbox.input(on_shadow_checkbox_changed);
    shadow_checkbox.parent(checkbox_group);

    let contour_label = createP('Contour');
    contour_label.parent(checkbox_group);
    contour_checkbox = createCheckbox('', add_contour);
    contour_checkbox.input(on_contour_checkbox_changed);
    contour_checkbox.parent(checkbox_group);

    font_group = createDiv();
    font_group.parent(style_box);
    font_group.addClass("group");

    let font_label = createP('Font');
    font_label.parent(font_group);
    font_selection = createSelect();
    for (const font_index in FONT_LIST)
    {
        option = font_selection.option(FONT_LIST[font_index]);
    }
    font_selection.changed(on_font_changed);
    font_selection.parent(font_group);

    // COLOR
    color_box = createDiv();
    color_box.parent("parameters-container");
    color_box.addClass("box");
    color_box_title = createElement('h1', 'COLOR');
    color_box_title.parent(color_box);

    colors_group_labels = createDiv();
    colors_group_labels.parent(color_box);
    colors_group_labels.addClass("group");

    colors_group_sliders = createDiv();
    colors_group_sliders.parent(color_box);
    colors_group_sliders.addClass("group");

    let background_label = createP('Background');
    background_label.parent(colors_group_labels);
    background_color_picker = createColorPicker(color(background_color).toString('#rrggbb'));
    background_color_picker.input(on_background_color_picker_changed);
    background_color_picker.parent(colors_group_sliders);

    let text_color_label = createP('Text');
    text_color_label.parent(colors_group_labels);
    text_color_picker = createColorPicker(color(text_color).toString('#rrggbb'));
    text_color_picker.input(on_text_color_picker_changed);
    text_color_picker.parent(colors_group_sliders);

    let rays_color_label = createP('Rays Palette');
    rays_color_label.parent(color_box);

    color_palette_group = createDiv();
    color_palette_group.parent(color_box);
    color_palette_group.addClass("group");

    rays_palette_selection = createSelect();
    for (const palette_name in COLOR_PALETTES)
    {
        option = rays_palette_selection.option(palette_name);
    }
    rays_palette_selection.changed(on_rays_palette_changed);
    rays_palette_selection.parent(color_palette_group);
    rays_palette_selection.value(rays_palette);

    single_custom_color_picker = createColorPicker(color(single_custom_color).toString('#rrggbb'));
    single_custom_color_picker.input(on_single_custom_color_picker_changed);
    single_custom_color_picker.parent(color_palette_group);

    // To guarantee an exact download resolution.
    pixelDensity(1);

    // Create Canvas
    canvas = create_canvas(canvas_width, canvas_height);

    // Update canvas with initial parameters.
    update_canvas();
}

function create_canvas(width, height)
{
    canvas = createCanvas(canvas_width, canvas_height);
    canvas.style("background", "#FFFFFF");
    canvas.style("border-radius", "50px");
    canvas.style("box-shadow", "0px 4px 30px rgba(0, 0, 0, 0.02)");
    canvas.parent("canvas-element");
}

function on_text_changed()
{
    input_text = this.value();
    update_canvas();
}

function on_text_size_changed()
{
    text_size = this.value() / 100;
    update_canvas();  
}

function on_position_x_changed()
{
    position_x = this.value() / 100;
    update_canvas();
}

function on_position_y_changed()
{
    position_y = this.value() / 100;
    update_canvas();
}

function on_shadow_checkbox_changed()
{
    update_canvas();
}

function on_contour_checkbox_changed()
{
    update_canvas();
}

function on_font_changed()
{
    font_name = this.value()
    update_canvas();
}

function on_background_color_picker_changed()
{
    input_color = this.value();
    background_color = [red(input_color), green(input_color), blue(input_color)];
    update_canvas();
}

function on_text_color_picker_changed()
{
    input_color = this.value();
    text_color = [red(input_color), green(input_color), blue(input_color)];
    update_canvas();
}

function on_rays_palette_changed()
{
    rays_palette = this.value()
    update_canvas();
}

function on_single_custom_color_picker_changed()
{
    input_color = this.value();
    single_custom_color = [red(input_color), green(input_color), blue(input_color)];
    COLOR_PALETTES["Single Custom Color"] = [single_custom_color];
    rays_palette = "Single Custom Color";
    rays_palette_selection.value(rays_palette);
    update_canvas();
}

function update_canvas()
{
    const img = create_image(canvas_width, canvas_height);
    image(img, 0, 0, canvas_width, canvas_height);
}

function download_image(format, filename)
{
    const img = create_image(DIMENSIONS[format][0], DIMENSIONS[format][1]);
    save(img, filename);
}

function create_image(width, height)
{
    const img = createGraphics(width, height);
    img.background(background_color);

    img.textFont(font_name);
    img.textSize(text_size * width)

    let shadow = color(0, 0, 0)
    shadow.setAlpha(30)
    let shadow_length = int(width / 100);
    let stroke_weight = int(width / 100) * 2;
    let text_w = 0;

    let lines = input_text.split(/\r?\n/);

    let spacing = 0.85 * text_size;
    let letter_count = 0;

    for (let line_i = 0; line_i < lines.length; ++line_i)
    {
        line = lines[line_i]
        for (let letter_i = 0; letter_i < line.length; ++letter_i)
        {
            ray_color = COLOR_PALETTES[rays_palette][letter_count % COLOR_PALETTES[rays_palette].length];
            letter = line[letter_i]
            img.fill(ray_color)

            if(contour_checkbox.checked())
            {
                img.stroke(ray_color)
                img.strokeWeight(stroke_weight);
            }

            for(let i = 0; i < height - (position_y+line_i*50); ++i)
            {
                img.text(letter, position_x * width + i + text_w, position_y * height + i + (height*line_i*spacing));
            }

            if(shadow_checkbox.checked())
            {
                img.fill(shadow);
                img.text(letter, position_x * width + text_w + shadow_length, position_y * height + (height*line_i*spacing) + shadow_length);
            }

            img.fill(text_color);
            img.text(letter, position_x * width + text_w - 1, position_y * height - 1 + (height*line_i*spacing));
            img.noStroke()

            text_w = text_w + img.textWidth(letter);
            
            if(letter!=" ")
            {
                letter_count = letter_count + 1;
            }

        }
        text_w = 0;
    }

    // Add margin
    let mask = createGraphics(width, height);
    mask.background(0, 0, 0, 0);
    mask.fill(255, 255, 255, 255);
    let margin = width * 0.07;
    mask.rect(int(margin), int(margin), width - margin*2, height - margin*2);
    let imgCopy = img.get();
    let maskCopy = mask.get();
    imgCopy.mask(maskCopy);
    img.background(255, 255, 255);
    img.image(imgCopy, 0, 0);
    img.blend(imgCopy, 0, 0, width, height, 0, 0, width, height, DARKEST);

    return img;

}

function windowResized()
{
    canvas_height = window.innerHeight - 100 - 63;
    canvas_width = Math.round(canvas_height / 1.41);
    canvas = create_canvas(canvas_width, canvas_height);
    update_canvas();
}

