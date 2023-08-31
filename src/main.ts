import * as $ from 'jquery';
import * as sample from 'C:/Users/nikol/Documents/code-generator/src/assets/clothes.json';

type Option = {
  code: string;
  description: string;
}

type Variety = {
  code: string;
  description: string;
  options: Option[];
}

type Item = {
  code: string;
  description: string;
  varieties: string[];
}

type Data = {
  varieties: Variety[];
  items: Item[];
}


let data: Data = sample;

const itemDropdown = $('#item');
const colorDropdown = $('#color');
const sizeDropdown = $('#size');
const itemCode = $('#itemCode');

data.items.forEach(item => {
  const option = $('<option>', {
    value: item.code,
    text: item.description
  });
  itemDropdown.append(option);
});

itemDropdown.on('change', function () {
  const selectedItemCode = $(this).val();
  const selectedItem = data.items.find(item => item.code === selectedItemCode);

  itemCode.empty();

  colorDropdown.empty().append($('<option>', {
    value: '',
    text: 'Select a color'
  }));

  sizeDropdown.empty().append($('<option>', {
    value: '',
    text: 'Select a size'
  }));
  if (selectedItem) {
    selectedItem.varieties.forEach(varietyCode => {
      const variety = data.varieties.find(v => v.code === varietyCode);
      if (variety) {
        const dropdown = variety.code === 'COLOR' ? colorDropdown : sizeDropdown;
        variety.options.forEach(option => {
          dropdown.append($('<option>', {
            value: option.code,
            text: option.description
          }));
        });
      }
    });
  }
});

function updateItemCode() {
  const selectedItemCode = itemDropdown.val();
  const selectedColorCode = colorDropdown.val();
  const selectedSizeCode = sizeDropdown.val();

  let itemCodeResult: string;

  const itemVarieties = data.items.find(item => item.code === selectedItemCode)?.varieties || [];

  const selectedVarietyCodes = itemVarieties.map(varietyCode => {
    switch (varietyCode) {
      case 'COLOR':
        return selectedColorCode;
      case 'SHOE-SIZE':
      case 'SIZE':
        return selectedSizeCode;
      default:
        return '';
    }
  });

  if (!selectedVarietyCodes.includes('')) {
    itemCodeResult = [selectedItemCode, ...selectedVarietyCodes].filter(code => code !== '').join('.');
    itemCode.text(itemCodeResult);
  } else {
    itemCode.text("Select all available options");
  }
}

itemDropdown.on('change', updateItemCode);
colorDropdown.on('change', updateItemCode);
sizeDropdown.on('change', updateItemCode);
