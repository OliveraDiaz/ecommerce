const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll({
    attributes: [ 'id', 'category_name' ],
    include: [
      {
        model: Product,
        attributes: [ 'id', 'product_name', 'price', 'stock', 'category_id' ]
      }
    ]
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });

  // find all categories
  // be sure to include its associated Products
  
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, { 
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  }
  catch (err) {
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products

});

router.post('/', (req, res) => {
  Category.create(req.body)
  .then((category) => {
    if (req.body.categoryIds && req.body.categoryIds.length) {
        const productCategoryIdArr = req.body.categoryIds.map((category_id) => {  
        return {
          product_id: req.body.product_id,
          category_id,
        };
      });
      return productCategoryIdArr.bulkCreate(productCategoryIdArr);
    }
    res.status(200).json(category);
  // create a new category
})
.then((productCategoryIds) => {
  if (productCategoryIds) {
    res.status(200).json(productCategoryIds);
  }else {
    res.status(200).json(category);
  }
})

.catch((err) => {
  console.log(err);
  res.status(400).json(err);
});
});


router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData[0]) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    if (req.body.categoryIds && req.body.categoryIds.length) {
     await ProductCategory.destory({
        where: {
          category_id: req.params.id,
        },
      });
      const productCategoryIdArr = req.body.categoryIds.map((category_id) => {
        return {
          product_id: req.body.product_id,
          category_id,
        };
      });
      await ProductCategory.bulkCreate(productCategoryIdArr);
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((rowsAffected) => {
    if (rowsAffected === 0) {
      res.status(404).json({ message: 'No category found with this id!' }); 
    }else{
      res.status(204).end();
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });


  // delete a category by its `id` value
});

module.exports = router;
