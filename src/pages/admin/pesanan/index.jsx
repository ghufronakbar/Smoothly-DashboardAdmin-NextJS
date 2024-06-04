import { HeadAdmin } from "@/components/HeadAdmin";
import { SidebarMenu } from "@/components/SidebarOrganization";
import { TablePesanan } from "@/components/table/TablePesanan";
import { withAuth } from "@/lib/authorization";
import { Container, Flex, Heading } from "@chakra-ui/react";

function Pesanan() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />{" "}
          <Container maxW="80%">
            <Heading marginBottom="8" marginTop="8">
              Pesanan
            </Heading>
            <TablePesanan />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(Pesanan);
