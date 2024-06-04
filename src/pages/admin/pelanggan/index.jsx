import { HeadAdmin } from "@/components/HeadAdmin";
import { SidebarMenu } from "@/components/SidebarOrganization";
import { TablePelanggan } from "@/components/table/TablePelanggan";
import { withAuth } from "@/lib/authorization";
import { Container, Flex, Heading } from "@chakra-ui/react";

function Pelanggan() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />{" "}
          <Container maxW="80%">
            <Heading marginBottom="8" marginTop="8">
              Pelanggan
            </Heading>
            <TablePelanggan/>
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(Pelanggan);
