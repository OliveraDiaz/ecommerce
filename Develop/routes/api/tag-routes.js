const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const { update } = require('../../models/Product');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  console.log(`${req.method} request received to get all tags`);
  Tag.findAll({
    attributes: [ 'id', 'tag_name' ],
    include: [
      {
        model: Product,
        attributes: [ 'id', 'product_name', 'price', 'stock', 'category_id' ] 
      }
    ]
  })

  // find all tags
  // be sure to include its associated Product data

  .then(dbTagData => res.json(TagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tagData);
  }
  catch (err) {
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  Tag.create(req.body)
  .then((tag) => {
    if (req.body.tagIds && req.body.tagIds.length) {
       const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: req.body.product_id,
        tag_id,
      };
    });
    return ProductTag.bulkCreate(productTagIdArr);
  }
  res.status(200).json(tag);
  // create a new tag
})
.then((productTagIds) => {
  if (productTagIds) {
    res.status(200).json(productTagIds);
  } else {
    res.status(200).json(tag);
  }
})

.catch((err) => {
  console.log(err);
  res.status(400).json(err);
  });
});



router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!updatedTag[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
    return;
  }

   if(req.body.tagIds && req.body.tagIds.length) {
    await ProductTag.destroy({
      where: {
        tag_id: req.params.id,
      },
    });
  const productTagIdArr = req.body.tagIds.map((tag_id) => {
    return {
      product_id: req.body.product_id,
      tag_id,
    };
  });
  await ProductTag.bulkCreate(productTagIdArr);
   }
  res.status(200).json(updatedTag);
} catch (err) {
  console.error(err);
  res.status(400).json(err);
}
});


router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((deletedTag) => {
    res.json(deletedTag);
  })
  .catch((err) => res.json(err));

  // delete on tag by its `id` value
});

module.exports = router;
