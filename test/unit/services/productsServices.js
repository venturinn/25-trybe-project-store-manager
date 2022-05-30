const { expect } = require("chai");
const sinon = require("sinon");

const productsServices = require("../../../services/productsServices");
const productsModels = require("../../../models/productsModels");

// A função "updateProductQuantity" não possui retorno e não foi testada"

describe("Service: busca todos os produtos cadastrados no BD", () => {
  describe("Quando não existe nenhum produto criado", () => {
    before(() => {
      res = [];
      sinon.stub(productsModels, "getAllProducts").resolves(res);
    });

    after(() => {
      productsModels.getAllProducts.restore();
    });

    it("Retorna um array", async () => {
      const response = await productsServices.getAllProducts();
      expect(response).to.be.an("array");
    });
    it("O array retornado está vazio", async () => {
      const response = await productsServices.getAllProducts();
      expect(response).to.be.empty;
    });
  });

  describe("Quando existem produtos criados", () => {
    before(async () => {
      const res = [
        { id: 1, name: "Martelo de Thor", quantity: 10 },
        { id: 2, name: "Traje de encolhimento", quantity: 20 },
        { id: 3, name: "Escudo do Capitão América", quantity: 30 },
      ];
      sinon.stub(productsModels, "getAllProducts").resolves(res);
    });

    after(async () => {
      productsModels.getAllProducts.restore();
    });

    it("Retorna um array", async () => {
      const response = await productsServices.getAllProducts();
      expect(response).to.be.an("array");
    });
    it("O array retornado não está vazio", async () => {
      const response = await productsServices.getAllProducts();
      expect(response).to.be.not.empty;
    });
    it("O array possui itens do tipo objeto", async () => {
      const response = await productsServices.getAllProducts();
      expect(response[0]).to.be.an("object");
    });
    it('Os itens possuem as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsServices.getAllProducts();
      expect(response[0]).to.include.all.keys("id", "name", "quantity");
      expect(response[1]).to.include.all.keys("id", "name", "quantity");
      expect(response[2]).to.include.all.keys("id", "name", "quantity");
    });
  });
});

describe("Service: busca um produto por meio do 'id'", () => {
  describe("Quando o 'id' buscado existe", () => {
    before(async () => {
      const res = { id: 1, name: "Martelo de Thor", quantity: 10 };

      sinon.stub(productsModels, "findProductById").resolves(res);
    });

    after(async () => {
      productsModels.findProductById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.findProductById(1);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await productsServices.findProductById(1);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsServices.findProductById(1);
      expect(response).to.include.all.keys("id", "name", "quantity");
    });
  });

  describe("Quando o 'id' buscado não existe", () => {
    before(async () => {
      const res = null;

      sinon.stub(productsModels, "findProductById").resolves(res);
    });

    after(async () => {
      productsModels.findProductById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.findProductById(1000);
      expect(response).to.be.an("object");
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await productsServices.findProductById(1000);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "notFound"', async () => {
      const response = await productsServices.findProductById(1000);
      expect(response.error.code).to.equal("notFound");
    });
    it('A propriedade "message" possui o valor: "Product not found"', async () => {
      const response = await productsServices.findProductById(1000);
      expect(response.error.message).to.equal("Product not found");
    });
  });
});

describe("Service: adiciona uma novo produto", () => {
  describe("Quando o produto ja existe", () => {
    before(async () => {
      const res = [{ id: 1, name: "Martelo de Thor", quantity: 10 }];
      sinon.stub(productsModels, "findProductByName").resolves(res);
    });

    after(async () => {
      productsModels.findProductByName.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.addNewProduct(
        "Martelo de Thor",
        10
      );
      expect(response).to.be.an("object");
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await productsServices.addNewProduct(
        "Martelo de Thor",
        10
      );
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "alreadyExists"', async () => {
      const response = await productsServices.addNewProduct(
        "Martelo de Thor",
        10
      );
      expect(response.error.code).to.equal("alreadyExists");
    });
    it('A propriedade "message" possui o valor: "Product already exists"', async () => {
      const response = await productsServices.addNewProduct(
        "Martelo de Thor",
        10
      );
      expect(response.error.message).to.equal("Product already exists");
    });
  });

  describe("Quando o produto ainda não existe", () => {
    before(async () => {
      const res1 = null;
      const res2 = 4;
      sinon.stub(productsModels, "findProductByName").resolves(res1);
      sinon.stub(productsModels, "addNewProduct").resolves(res2);
    });

    after(async () => {
      productsModels.findProductByName.restore();
      productsModels.addNewProduct.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.addNewProduct("newProduct", 101);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await productsServices.addNewProduct("newProduct", 101);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsServices.addNewProduct("newProduct", 101);
      expect(response).to.include.all.keys("id", "name", "quantity");
    });
    it("Os valores das propriedades do objeto retornado estão corretos", async () => {
      const response = await productsServices.addNewProduct("newProduct", 101);
      expect(response.id).to.equal(4);
      expect(response.name).to.equal("newProduct");
      expect(response.quantity).to.equal(101);
    });
  });
});

describe("Service: atualiza um produto existente", () => {
  describe("Quando o produto existe no BD", () => {
    before(async () => {
      const res = { id: 1, name: "Martelo de Thor", quantity: 10 };
      sinon.stub(productsModels, "findProductById").resolves(res);
      sinon.stub(productsModels, "updateProduct").resolves();
    });

    after(async () => {
      productsModels.findProductById.restore();
      productsModels.updateProduct.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.updateProduct(
        1,
        "Martelo de Thor",
        101
      );
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await productsServices.updateProduct(
        1,
        "Martelo de Thor",
        101
      );
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsServices.updateProduct(
        1,
        "Martelo de Thor",
        101
      );
      expect(response).to.include.all.keys("id", "name", "quantity");
    });
    it("Os valores das propriedades do objeto retornado estão corretos", async () => {
      const response = await productsServices.updateProduct(
        1,
        "Martelo de Thor",
        101
      );
      expect(response.id).to.equal(1);
      expect(response.name).to.equal("Martelo de Thor");
      expect(response.quantity).to.equal(101);
    });
  });

  describe("Quando o produto não existe no BD", () => {
    before(async () => {
      const res1 = null;
      sinon.stub(productsModels, "findProductById").resolves(res1);
    });

    after(async () => {
      productsModels.findProductById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.updateProduct(
        100,
        "newProduct",
        14
      );
      expect(response).to.be.an("object");
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await productsServices.updateProduct(
        100,
        "Martelo de Thor",
        10
      );
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "notFound"', async () => {
      const response = await productsServices.updateProduct(
        100,
        "Martelo de Thor",
        10
      );
      expect(response.error.code).to.equal("notFound");
    });
    it('A propriedade "message" possui o valor: "Product not found"', async () => {
      const response = await productsServices.updateProduct(
        100,
        "Martelo de Thor",
        10
      );
      expect(response.error.message).to.equal("Product not found");
    });
  });
});

describe("Service: deleta um produto", () => {
  describe("Quando o produto existe no BD", () => {
    before(async () => {
      const res = { id: 1, name: "Martelo de Thor", quantity: 10 };
      sinon.stub(productsModels, "findProductById").resolves(res);
      sinon.stub(productsModels, "deleteProduct").resolves();
    });

    after(async () => {
      productsModels.findProductById.restore();
      productsModels.deleteProduct.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.deleteProduct(1);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await productsServices.deleteProduct(1);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui a propriedade: "deleted"', async () => {
      const response = await productsServices.deleteProduct(1);

      expect(response).to.include.all.keys("deleted");
    });
    it("O valor da propriedade do objeto retornado está correto", async () => {
      const response = await productsServices.deleteProduct(1);
      expect(response.deleted).to.equal(1);
    });
  });

  describe("Quando o produto não existe no BD", () => {
    before(async () => {
      const res1 = null;
      sinon.stub(productsModels, "findProductById").resolves(res1);
    });

    after(async () => {
      productsModels.findProductById.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsServices.deleteProduct(100);
      expect(response).to.be.an("object");
    });
    it('O objeto retornado possui a propriedade: "error", "code" e "message"', async () => {
      const response = await productsServices.deleteProduct(100);
      expect(response).to.include.all.keys("error");
      expect(response.error).to.include.all.keys("code", "message");
    });
    it('A propriedade "code" possui o valor: "notFound"', async () => {
      const response = await productsServices.deleteProduct(100);
      expect(response.error.code).to.equal("notFound");
    });
    it('A propriedade "message" possui o valor: "Product not found"', async () => {
      const response = await productsServices.deleteProduct(100);
      expect(response.error.message).to.equal("Product not found");
    });
  });
});
