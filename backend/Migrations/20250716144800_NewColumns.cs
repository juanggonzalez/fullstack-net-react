using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FullstackNetReact.Migrations
{
    /// <inheritdoc />
    public partial class NewColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_ShoppingCartItems_ShoppingCartItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCartItems_ShoppingCartItems_ShoppingCartItemId",
                table: "ShoppingCartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCartItems_ShoppingCarts_ShoppingCartId",
                table: "ShoppingCartItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ShoppingCarts",
                table: "ShoppingCarts");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ShoppingCartItemId",
                table: "OrderItems");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DropColumn(
                name: "ShoppingCartItemId",
                table: "OrderItems");

            migrationBuilder.RenameColumn(
                name: "LastModifiedAt",
                table: "ShoppingCarts",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "ShoppingCartItemId",
                table: "ShoppingCartItems",
                newName: "ProductId1");

            migrationBuilder.RenameColumn(
                name: "PriceAtAddition",
                table: "ShoppingCartItems",
                newName: "PriceAtTimeOfAddition");

            migrationBuilder.RenameIndex(
                name: "IX_ShoppingCartItems_ShoppingCartItemId",
                table: "ShoppingCartItems",
                newName: "IX_ShoppingCartItems_ProductId1");

            migrationBuilder.AddColumn<int>(
                name: "ShoppingCartId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ShoppingCarts",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "ShoppingCartId",
                table: "ShoppingCartItems",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ShoppingCarts",
                table: "ShoppingCarts",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ShoppingCartId",
                table: "Users",
                column: "ShoppingCartId");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCarts_UserId",
                table: "ShoppingCarts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCartItems_Products_ProductId1",
                table: "ShoppingCartItems",
                column: "ProductId1",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCartItems_ShoppingCarts_ShoppingCartId",
                table: "ShoppingCartItems",
                column: "ShoppingCartId",
                principalTable: "ShoppingCarts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ShoppingCarts_ShoppingCartId",
                table: "Users",
                column: "ShoppingCartId",
                principalTable: "ShoppingCarts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCartItems_Products_ProductId1",
                table: "ShoppingCartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCartItems_ShoppingCarts_ShoppingCartId",
                table: "ShoppingCartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_ShoppingCarts_ShoppingCartId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ShoppingCartId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ShoppingCarts",
                table: "ShoppingCarts");

            migrationBuilder.DropIndex(
                name: "IX_ShoppingCarts_UserId",
                table: "ShoppingCarts");

            migrationBuilder.DropColumn(
                name: "ShoppingCartId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ShoppingCarts");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "ShoppingCarts",
                newName: "LastModifiedAt");

            migrationBuilder.RenameColumn(
                name: "ProductId1",
                table: "ShoppingCartItems",
                newName: "ShoppingCartItemId");

            migrationBuilder.RenameColumn(
                name: "PriceAtTimeOfAddition",
                table: "ShoppingCartItems",
                newName: "PriceAtAddition");

            migrationBuilder.RenameIndex(
                name: "IX_ShoppingCartItems_ProductId1",
                table: "ShoppingCartItems",
                newName: "IX_ShoppingCartItems_ShoppingCartItemId");

            migrationBuilder.AlterColumn<string>(
                name: "ShoppingCartId",
                table: "ShoppingCartItems",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ShoppingCartItemId",
                table: "OrderItems",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ShoppingCarts",
                table: "ShoppingCarts",
                column: "UserId");

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "BrandId", "CategoryId", "Description", "ImageUrl", "Name", "Price", "SellerId", "Sku", "Stock" },
                values: new object[] { 7, 3, 3, "Camiseta suave y cómoda, ideal para uso diario.", "/images/camiseta.jpg", "Camiseta Algodón Premium", 30.00m, 1, "CAP-007", 200 });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ShoppingCartItemId",
                table: "OrderItems",
                column: "ShoppingCartItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_ShoppingCartItems_ShoppingCartItemId",
                table: "OrderItems",
                column: "ShoppingCartItemId",
                principalTable: "ShoppingCartItems",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCartItems_ShoppingCartItems_ShoppingCartItemId",
                table: "ShoppingCartItems",
                column: "ShoppingCartItemId",
                principalTable: "ShoppingCartItems",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCartItems_ShoppingCarts_ShoppingCartId",
                table: "ShoppingCartItems",
                column: "ShoppingCartId",
                principalTable: "ShoppingCarts",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
