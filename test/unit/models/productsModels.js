const sinon = require("sinon");
const { expect } = require("chai");
const connection = require("../../../models/connection");
const productsModels = require("../../../models/productsModels");

// Funções "updateProduct", "deleteProduct" e "updateProductQuantity não possuem retorno e não foram testadas"

describe("Model: busca todos os produtos cadastrados no BD", () => {
  describe("Quando não existe nenhum produto criado", () => {
    before(async () => {
      const res = [[]];

      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna um array", async () => {
      const response = await productsModels.getAllProducts();
      expect(response).to.be.an("array");
    });
    it("O array retornado está vazio", async () => {
      const response = await productsModels.getAllProducts();
      expect(response).to.be.empty;
    });
  });
  describe("Quando existem produtos criados", () => {
    before(async () => {
      const res = [
        [
          { id: 1, name: "Martelo de Thor", quantity: 10 },
          { id: 2, name: "Traje de encolhimento", quantity: 20 },
          { id: 3, name: "Escudo do Capitão América", quantity: 30 },
        ],
      ];
      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna um array", async () => {
      const response = await productsModels.getAllProducts();
      expect(response).to.be.an("array");
    });
    it("O array retornado não está vazio", async () => {
      const response = await productsModels.getAllProducts();
      expect(response).to.be.not.empty;
    });
    it("O array possui itens do tipo objeto", async () => {
      const response = await productsModels.getAllProducts();
      expect(response[0]).to.be.an("object");
    });
    it('Os itens possuem as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsModels.getAllProducts();
      expect(response[0]).to.include.all.keys("id", "name", "quantity");
      expect(response[1]).to.include.all.keys("id", "name", "quantity");
      expect(response[2]).to.include.all.keys("id", "name", "quantity");
    });
  });
});

describe("Model: busca um produto por meio do 'id'", () => {
  describe("Quando o 'id' buscado existe", () => {
    before(async () => {
      const res = [[{ id: 2, name: "Traje de encolhimento", quantity: 20 }]];

      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna um objeto", async () => {
      const response = await productsModels.findProductById(2);
      expect(response).to.be.an("object");
    });
    it("O objeto retornado não está vazio", async () => {
      const response = await productsModels.findProductById(2);
      expect(response).to.be.not.empty;
    });
    it('O objeto retornado possui as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsModels.findProductById(2);
      expect(response).to.include.all.keys("id", "name", "quantity");
    });
  });

  describe("Quando o 'id' buscado não existe", () => {
    before(async () => {
      const res = [[]];

      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna 'null'", async () => {
      const response = await productsModels.findProductById(1000);
      expect(response).to.be.an("null");
    });
  });
});

describe("Model: insere um novo produto no BD", () => {
  before(async () => {
    const res = [{ insertId: 1 }];

    sinon.stub(connection, "execute").resolves(res);
  });

  after(async () => {
    connection.execute.restore();
  });

  describe("Quando é inserido com sucesso", () => {
    it('Retorna o "id" do novo produto inserido', async () => {
      const response = await productsModels.addNewProduct("newProductName", 10);
      expect(response).to.equal(1);
    });
  });
});

describe("Model: busca um produto por meio do 'name'", () => {
  describe("Quando o 'name' buscado existe", () => {
    before(async () => {
      const res = [[{ id: 2, name: "Traje de encolhimento", quantity: 20 }]];

      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna um array", async () => {
      const response = await productsModels.findProductByName(
        "Traje de encolhimento"
      );
      expect(response).to.be.an("array");
    });
    it("O array retornado não está vazio", async () => {
      const response = await productsModels.findProductByName(
        "Traje de encolhimento"
      );
      expect(response).to.be.not.empty;
    });
    it('O array retornado possui um objeto com as propriedades: "id", "name" e "quantity"', async () => {
      const response = await productsModels.findProductByName(
        "Traje de encolhimento"
      );
      expect(response[0]).to.include.all.keys("id", "name", "quantity");
    });
  });

  describe("Quando o 'id' buscado não existe", () => {
    before(async () => {
      const res = [[]];

      sinon.stub(connection, "execute").resolves(res);
    });

    after(async () => {
      connection.execute.restore();
    });

    it("Retorna 'null'", async () => {
      const response = await productsModels.findProductByName(
        "namenoNexistent"
      );
      expect(response).to.be.an("null");
    });
  });
});
